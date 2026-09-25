package algoflow;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.eclipse.jdt.core.compiler.batch.BatchCompiler;

/**
 * 브라우저(CheerpJ 워커)와 Node 검증(진짜 JDK)이 함께 쓰는 Java 채점 하네스.
 *
 * <p>사용자 코드는 {@code class Solution { ... solution(...) }} 형태다. compile()로 한 번 컴파일하고, 케이스마다 run()을
 * 부른다. 두 함수 모두 JSON 문자열 하나를 돌려준다 (Python 하네스와 같은 모양):
 *
 * <pre>
 * { "ok": true,  "value": ..., "stdout": "...", "timeMs": 1.2 }
 * { "ok": false, "phase": "compile" | "runtime", "error": {type, message, line, traceback}, "stdout": "...", "timeMs": 0 }
 * </pre>
 */
public final class Runner {
  private static final String CLASS_NAME = "Solution";
  private static final String METHOD_NAME = "solution";
  private static final Pattern EMACS_LINE = Pattern.compile("^(.*?\\.java):(\\d+): (error|warning): (.*)$");

  /** 컴파일 결과로 만든 클래스 (runDir → Solution 클래스) */
  private static final Map<String, Class<?>> LOADED = new HashMap<>();

  /** ECJ에 넘길 시스템 라이브러리 옵션. 브라우저는 가짜 JDK 폴더(--system), 진짜 JDK는 비워 둔다 */
  private static String systemOption = "";

  private Runner() {}

  /**
   * CheerpJ에서만 호출한다. ECJ는 --system 폴더에 release 파일과 lib/jrt-fs.jar가 있어야 받아 주는데, CheerpJ 런타임에는
   * 없다. 실행 중인 JVM과 같은 버전이라고 적어 두면 ECJ가 jrt:/ 파일 시스템을 그대로 쓴다.
   */
  public static String prepareBrowserSystem(String dir) {
    try {
      File lib = new File(dir, "lib");
      lib.mkdirs();
      String version = System.getProperty("java.version");
      Files.write(new File(dir, "release").toPath(), ("JAVA_VERSION=\"" + version + "\"\n").getBytes(StandardCharsets.UTF_8));
      File jrt = new File(lib, "jrt-fs.jar");
      if (!jrt.exists()) Files.write(jrt.toPath(), new byte[0]);
      systemOption = "--system " + dir + " ";
      return version;
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /** source를 runDir에 컴파일한다. 성공하면 {"ok":true}, 실패하면 첫 오류를 compile 단계 오류로 */
  public static String compile(String source, String runDir) {
    long started = System.nanoTime();
    try {
      File dir = new File(runDir);
      File classes = new File(dir, "classes");
      classes.mkdirs();
      File file = new File(dir, CLASS_NAME + ".java");
      Files.write(file.toPath(), source.getBytes(StandardCharsets.UTF_8));

      StringWriter out = new StringWriter();
      PrintWriter writer = new PrintWriter(out);
      String command =
          "-11 -g -proc:none -nowarn -Xemacs -encoding UTF-8 "
              + systemOption
              + "-d "
              + quote(classes.getPath())
              + " "
              + quote(file.getPath());
      boolean ok = BatchCompiler.compile(command, writer, writer, null);
      writer.flush();
      if (ok) return "{\"ok\":true,\"timeMs\":" + millis(started) + "}";
      return compileError(out.toString());
    } catch (Throwable e) {
      return failure("compile", "CompileError", "컴파일러를 실행하지 못했어요: " + e, null, "", "", 0);
    }
  }

  private static String quote(String path) {
    return path.contains(" ") ? "\"" + path + "\"" : path;
  }

  private static String compileError(String log) {
    String[] lines = log.split("\\r?\\n");
    for (int i = 0; i < lines.length; i++) {
      Matcher m = EMACS_LINE.matcher(lines[i]);
      if (m.matches() && m.group(3).equals("error")) {
        int line = Integer.parseInt(m.group(2));
        String message = m.group(4).trim();
        return failure("compile", "CompileError", message, line, cleanLog(log), "", 0);
      }
    }
    String message = log.trim().isEmpty() ? "컴파일하지 못했어요" : log.trim().split("\\r?\\n")[0];
    return failure("compile", "CompileError", message, null, cleanLog(log), "", 0);
  }

  /** 컴파일 로그에서 임시 폴더 경로를 지워 사용자에게 보여 준다 */
  private static String cleanLog(String log) {
    return log.replace("\r\n", "\n").replaceAll("(?m)^.*?(Solution\\.java):", "$1:").trim();
  }

  /** 컴파일해 둔 runDir의 Solution.solution(...)을 argsJson으로 호출한다 */
  public static String run(String runDir, String argsJson, int stdoutLimit) {
    LimitedStream buffer = new LimitedStream(stdoutLimit);
    PrintStream savedOut = System.out;
    PrintStream savedErr = System.err;
    long started = System.nanoTime();
    try {
      Class<?> type = load(runDir);
      Method method = findMethod(type);
      List<Object> json = asList(Json.parse(argsJson));
      Type[] params = method.getGenericParameterTypes();
      if (params.length != json.size()) {
        throw new UserError(
            "SignatureError",
            METHOD_NAME + " 함수의 매개변수는 " + json.size() + "개여야 해요 (지금은 " + params.length + "개)");
      }
      Object[] args = new Object[params.length];
      for (int i = 0; i < params.length; i++) args[i] = Convert.fromJson(json.get(i), params[i]);
      Object target = Modifier.isStatic(method.getModifiers()) ? null : newInstance(type);

      PrintStream capture = new PrintStream(buffer, true, "UTF-8");
      System.setOut(capture);
      System.setErr(capture);
      started = System.nanoTime();
      Object value = method.invoke(target, args);
      double timeMs = millis(started);
      capture.flush();
      restore(savedOut, savedErr);
      String valueJson = Json.write(value);
      return "{\"ok\":true,\"value\":" + valueJson + ",\"stdout\":" + Json.quote(buffer.text()) + ",\"timeMs\":" + timeMs + "}";
    } catch (InvocationTargetException e) {
      double timeMs = millis(started);
      restore(savedOut, savedErr);
      return runtimeError(e.getCause(), buffer.text(), timeMs);
    } catch (UserError e) {
      double timeMs = millis(started);
      restore(savedOut, savedErr);
      return failure("runtime", e.type, e.getMessage(), null, e.type + ": " + e.getMessage(), buffer.text(), timeMs);
    } catch (Throwable e) {
      double timeMs = millis(started);
      restore(savedOut, savedErr);
      return runtimeError(e, buffer.text(), timeMs);
    }
  }

  private static void restore(PrintStream out, PrintStream err) {
    System.setOut(out);
    System.setErr(err);
  }

  private static Class<?> load(String runDir) throws Exception {
    Class<?> cached = LOADED.get(runDir);
    if (cached != null) return cached;
    URL url = new File(runDir, "classes").toURI().toURL();
    // 부모는 이 하네스의 로더: 사용자 코드는 JDK 클래스만 쓰고, 컴파일마다 새 로더라 이전 Solution과 섞이지 않는다
    URLClassLoader loader = new URLClassLoader(new URL[] {url}, Runner.class.getClassLoader());
    Class<?> type;
    try {
      type = Class.forName(CLASS_NAME, true, loader);
    } catch (ClassNotFoundException e) {
      throw new UserError("NameError", "Solution 클래스를 찾을 수 없어요. class Solution { ... } 안에 solution 함수를 만들어 주세요.");
    }
    LOADED.put(runDir, type);
    return type;
  }

  private static Method findMethod(Class<?> type) {
    Method found = null;
    for (Method method : type.getDeclaredMethods()) {
      if (!method.getName().equals(METHOD_NAME) || method.isSynthetic()) continue;
      if (found != null) throw new UserError("NameError", "solution 함수가 여러 개예요. 하나만 남겨 주세요.");
      found = method;
    }
    if (found == null) {
      throw new UserError("NameError", "solution 함수를 찾을 수 없어요. Solution 클래스 안에 solution(...) 메서드를 만들어 주세요.");
    }
    found.setAccessible(true);
    return found;
  }

  private static Object newInstance(Class<?> type) throws Exception {
    try {
      java.lang.reflect.Constructor<?> constructor = type.getDeclaredConstructor();
      constructor.setAccessible(true);
      return constructor.newInstance();
    } catch (NoSuchMethodException e) {
      throw new UserError("NameError", "Solution 클래스에 매개변수 없는 생성자가 필요해요.");
    }
  }

  private static String runtimeError(Throwable error, String stdout, double timeMs) {
    if (error instanceof UserError) {
      UserError user = (UserError) error;
      return failure("runtime", user.type, user.getMessage(), null, user.type + ": " + user.getMessage(), stdout, timeMs);
    }
    String type = error.getClass().getSimpleName();
    String message = error.getMessage() == null ? "" : error.getMessage();
    // 브라우저 JVM(CheerpJ)은 스택이 넘치면 메시지 없는 ArithmeticException을 던지고, 대부분의 예외에 메시지가 없다
    boolean overflow =
        error instanceof StackOverflowError
            || (error instanceof ArithmeticException && message.isEmpty() && error.getStackTrace().length > 256);
    if (overflow) {
      type = "StackOverflowError";
      message = "재귀 호출이 너무 깊어요 (스택이 넘쳤어요)";
    } else if (error instanceof OutOfMemoryError) {
      message = "메모리를 너무 많이 썼어요";
    } else if (message.isEmpty()) {
      message = explain(error);
    }
    Integer line = null;
    StringBuilder trace = new StringBuilder();
    trace.append(overflow ? "java.lang.StackOverflowError" : error.getClass().getName()).append(message.isEmpty() ? "" : ": " + message).append('\n');
    int shown = 0;
    for (StackTraceElement frame : error.getStackTrace()) {
      String owner = frame.getClassName();
      if (!owner.equals(CLASS_NAME) && !owner.startsWith(CLASS_NAME + "$")) continue;
      if (line == null && frame.getLineNumber() > 0) line = frame.getLineNumber();
      if (shown++ < 8) {
        trace.append("  at ").append(owner).append('.').append(frame.getMethodName());
        if (frame.getLineNumber() > 0) trace.append(" (").append(frame.getLineNumber()).append("번째 줄)");
        trace.append('\n');
      }
    }
    return failure("runtime", type, message, line, trace.toString().trim(), stdout, timeMs);
  }

  /** 메시지 없는 흔한 예외를 쉬운 말로 (어느 메서드에서 났는지 덧붙인다) */
  private static String explain(Throwable error) {
    String what;
    if (error instanceof ArrayIndexOutOfBoundsException || error instanceof StringIndexOutOfBoundsException) {
      what = "배열이나 문자열의 범위를 벗어난 위치를 읽었어요";
    } else if (error instanceof IndexOutOfBoundsException) {
      what = "리스트의 범위를 벗어난 위치를 읽었어요";
    } else if (error instanceof NullPointerException) {
      what = "null인 값의 메서드나 필드를 썼어요";
    } else if (error instanceof ArithmeticException) {
      what = "0으로 나눴어요";
    } else if (error instanceof ClassCastException) {
      what = "값을 다른 타입으로 바꿀 수 없어요";
    } else if (error instanceof NumberFormatException) {
      what = "숫자로 바꿀 수 없는 문자열이에요";
    } else if (error instanceof java.util.NoSuchElementException) {
      what = "비어 있는 곳에서 값을 꺼냈어요";
    } else if (error instanceof java.util.ConcurrentModificationException) {
      what = "반복문으로 도는 중에 컬렉션을 바꿨어요";
    } else {
      what = "실행 중 예외가 났어요";
    }
    for (StackTraceElement frame : error.getStackTrace()) {
      String owner = frame.getClassName();
      if (owner.equals(CLASS_NAME) || owner.startsWith(CLASS_NAME + "$")) {
        return what + " (" + owner + "." + frame.getMethodName() + " 안에서)";
      }
    }
    return what;
  }

  private static String failure(
      String phase, String type, String message, Integer line, String traceback, String stdout, double timeMs) {
    Map<String, Object> error = new LinkedHashMap<>();
    error.put("type", type);
    error.put("message", message);
    error.put("line", line);
    error.put("traceback", traceback);
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("ok", false);
    payload.put("phase", phase);
    payload.put("error", error);
    payload.put("stdout", stdout);
    payload.put("timeMs", timeMs);
    return Json.write(payload);
  }

  private static double millis(long startedNanos) {
    return Math.round((System.nanoTime() - startedNanos) / 1000.0) / 1000.0;
  }

  @SuppressWarnings("unchecked")
  private static List<Object> asList(Object value) {
    if (!(value instanceof List)) throw new IllegalArgumentException("인자는 JSON 배열이어야 해요");
    return (List<Object>) value;
  }

  /** 사용자에게 그대로 보여 줄 오류 (하네스가 만든 안내) */
  static final class UserError extends RuntimeException {
    private static final long serialVersionUID = 1L;
    final String type;

    UserError(String type, String message) {
      super(message);
      this.type = type;
    }
  }

  /** 출력 크기를 제한하는 버퍼 */
  static final class LimitedStream extends OutputStream {
    private final ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    private final int limit;
    private boolean truncated = false;

    LimitedStream(int limit) {
      this.limit = limit;
    }

    @Override
    public void write(int b) {
      if (bytes.size() >= limit) {
        truncated = true;
        return;
      }
      bytes.write(b);
    }

    @Override
    public void write(byte[] b, int off, int len) {
      int room = limit - bytes.size();
      if (room <= 0) {
        truncated = truncated || len > 0;
        return;
      }
      if (len > room) truncated = true;
      bytes.write(b, off, Math.min(room, len));
    }

    String text() {
      String value;
      try {
        value = bytes.toString("UTF-8");
      } catch (UnsupportedEncodingException e) {
        value = bytes.toString();
      }
      value = value.replace("\r\n", "\n");
      return truncated ? value + "\n… (출력이 너무 길어서 잘랐어요)" : value;
    }
  }

  /** 테스트용: 하나의 문제에 대해 컴파일 + 여러 케이스 실행 (진짜 JDK에서 Node 검증이 부른다) */
  public static void main(String[] argv) throws Exception {
    // argv: <runDir> <source file> <cases json file> <stdoutLimit>
    String runDir = argv[0];
    String source = new String(Files.readAllBytes(new File(argv[1]).toPath()), StandardCharsets.UTF_8);
    String casesJson = new String(Files.readAllBytes(new File(argv[2]).toPath()), StandardCharsets.UTF_8);
    int stdoutLimit = Integer.parseInt(argv[3]);
    PrintStream out = new PrintStream(new java.io.FileOutputStream(java.io.FileDescriptor.out), true, "UTF-8");
    String compiled = compile(source, runDir);
    out.println(compiled);
    if (!compiled.startsWith("{\"ok\":true")) return;
    for (Object args : asList(Json.parse(casesJson))) {
      out.println(run(runDir, Json.write(args), stdoutLimit));
    }
  }
}
