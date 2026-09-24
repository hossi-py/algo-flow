package algoflow;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 작은 JSON 읽기·쓰기. 읽으면 null · Boolean · Long · Double · String · List · Map 으로 만든다.
 * 쓸 때는 사용자 반환값(배열, 컬렉션, 박싱 타입 …)을 JSON으로 바꾸며, 정수는 ±2^53 안이어야 한다 (JS·Python과 같은 규칙).
 */
final class Json {
  private static final long MAX_SAFE_INT = 9007199254740992L; // 2^53

  private Json() {}

  static Object parse(String text) {
    Parser parser = new Parser(text);
    Object value = parser.value();
    parser.skipSpace();
    if (parser.pos != text.length()) throw new IllegalArgumentException("JSON 뒤에 남은 글자가 있어요");
    return value;
  }

  static String write(Object value) {
    StringBuilder out = new StringBuilder();
    write(value, out, 0);
    return out.toString();
  }

  private static void write(Object value, StringBuilder out, int depth) {
    if (depth > 200) throw new Runner.UserError("ValueError", "반환값이 너무 깊게 중첩되어 있어요");
    if (value == null) {
      out.append("null");
    } else if (value instanceof Boolean) {
      out.append(value.toString());
    } else if (value instanceof Character) {
      out.append(quote(value.toString()));
    } else if (value instanceof String) {
      out.append(quote((String) value));
    } else if (value instanceof Double || value instanceof Float) {
      double d = ((Number) value).doubleValue();
      if (Double.isNaN(d) || Double.isInfinite(d)) {
        throw new Runner.UserError("ValueError", "반환값에 NaN 또는 무한대가 들어 있어요");
      }
      if (d == Math.rint(d) && Math.abs(d) < 1e15) out.append((long) d);
      else out.append(Double.toString(d));
    } else if (value instanceof Number) {
      long n = ((Number) value).longValue();
      if (Math.abs(n) > MAX_SAFE_INT || n == Long.MIN_VALUE) {
        throw new Runner.UserError("ValueError", "반환값의 정수가 너무 커요 (±2^53 이내여야 해요)");
      }
      out.append(n);
    } else if (value.getClass().isArray()) {
      int length = Array.getLength(value);
      out.append('[');
      for (int i = 0; i < length; i++) {
        if (i > 0) out.append(',');
        write(Array.get(value, i), out, depth + 1);
      }
      out.append(']');
    } else if (value instanceof Map) {
      out.append('{');
      boolean first = true;
      for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {
        if (!first) out.append(',');
        first = false;
        out.append(quote(String.valueOf(entry.getKey()))).append(':');
        write(entry.getValue(), out, depth + 1);
      }
      out.append('}');
    } else if (value instanceof Iterable) {
      out.append('[');
      boolean first = true;
      for (Object item : (Iterable<?>) value) {
        if (!first) out.append(',');
        first = false;
        write(item, out, depth + 1);
      }
      out.append(']');
    } else {
      throw new Runner.UserError(
          "TypeError",
          value.getClass().getSimpleName() + " 타입은 반환할 수 없어요 (배열, List, Map, 숫자, 문자열, boolean만 가능)");
    }
  }

  static String quote(String text) {
    StringBuilder out = new StringBuilder(text.length() + 2);
    out.append('"');
    for (int i = 0; i < text.length(); i++) {
      char c = text.charAt(i);
      switch (c) {
        case '"':
          out.append("\\\"");
          break;
        case '\\':
          out.append("\\\\");
          break;
        case '\n':
          out.append("\\n");
          break;
        case '\r':
          out.append("\\r");
          break;
        case '\t':
          out.append("\\t");
          break;
        default:
          if (c < 0x20) out.append(String.format("\\u%04x", (int) c));
          else out.append(c);
      }
    }
    return out.append('"').toString();
  }

  private static final class Parser {
    private final String text;
    int pos = 0;

    Parser(String text) {
      this.text = text;
    }

    void skipSpace() {
      while (pos < text.length() && Character.isWhitespace(text.charAt(pos))) pos++;
    }

    Object value() {
      skipSpace();
      if (pos >= text.length()) throw error();
      char c = text.charAt(pos);
      switch (c) {
        case '{':
          return object();
        case '[':
          return array();
        case '"':
          return string();
        case 't':
          expect("true");
          return Boolean.TRUE;
        case 'f':
          expect("false");
          return Boolean.FALSE;
        case 'n':
          expect("null");
          return null;
        default:
          return number();
      }
    }

    private Map<String, Object> object() {
      Map<String, Object> map = new LinkedHashMap<>();
      pos++;
      skipSpace();
      if (peek() == '}') {
        pos++;
        return map;
      }
      while (true) {
        skipSpace();
        String key = string();
        skipSpace();
        if (peek() != ':') throw error();
        pos++;
        map.put(key, value());
        skipSpace();
        char c = text.charAt(pos++);
        if (c == '}') return map;
        if (c != ',') throw error();
      }
    }

    private List<Object> array() {
      List<Object> list = new ArrayList<>();
      pos++;
      skipSpace();
      if (peek() == ']') {
        pos++;
        return list;
      }
      while (true) {
        list.add(value());
        skipSpace();
        char c = text.charAt(pos++);
        if (c == ']') return list;
        if (c != ',') throw error();
      }
    }

    private String string() {
      if (peek() != '"') throw error();
      pos++;
      StringBuilder out = new StringBuilder();
      while (true) {
        char c = text.charAt(pos++);
        if (c == '"') return out.toString();
        if (c != '\\') {
          out.append(c);
          continue;
        }
        char e = text.charAt(pos++);
        switch (e) {
          case 'n':
            out.append('\n');
            break;
          case 't':
            out.append('\t');
            break;
          case 'r':
            out.append('\r');
            break;
          case 'b':
            out.append('\b');
            break;
          case 'f':
            out.append('\f');
            break;
          case 'u':
            out.append((char) Integer.parseInt(text.substring(pos, pos + 4), 16));
            pos += 4;
            break;
          default:
            out.append(e);
        }
      }
    }

    private Object number() {
      int start = pos;
      while (pos < text.length() && "+-0123456789.eE".indexOf(text.charAt(pos)) >= 0) pos++;
      String token = text.substring(start, pos);
      if (token.isEmpty()) throw error();
      if (token.indexOf('.') < 0 && token.indexOf('e') < 0 && token.indexOf('E') < 0) return Long.parseLong(token);
      return Double.parseDouble(token);
    }

    private void expect(String word) {
      if (!text.startsWith(word, pos)) throw error();
      pos += word.length();
    }

    private char peek() {
      return pos < text.length() ? text.charAt(pos) : '\0';
    }

    private IllegalArgumentException error() {
      return new IllegalArgumentException("JSON을 읽을 수 없어요 (위치 " + pos + ")");
    }
  }

}
