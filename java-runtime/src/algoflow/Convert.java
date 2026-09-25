package algoflow;

import java.lang.reflect.Array;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.WildcardType;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

/** JSON 값(Json.parse 결과)을 solution 매개변수의 Java 타입으로 바꾼다 */
final class Convert {
  private Convert() {}

  static Object fromJson(Object json, Type type) {
    if (type instanceof WildcardType) type = ((WildcardType) type).getUpperBounds()[0];
    if (type instanceof ParameterizedType) return generic(json, (ParameterizedType) type);
    if (!(type instanceof Class)) return json;
    Class<?> target = (Class<?>) type;

    if (target == Object.class) return plain(json);
    if (target == int.class || target == Integer.class) return (int) integer(json, Integer.MIN_VALUE, Integer.MAX_VALUE, "int");
    if (target == long.class || target == Long.class) return integer(json, Long.MIN_VALUE, Long.MAX_VALUE, "long");
    if (target == short.class || target == Short.class) return (short) integer(json, Short.MIN_VALUE, Short.MAX_VALUE, "short");
    if (target == byte.class || target == Byte.class) return (byte) integer(json, Byte.MIN_VALUE, Byte.MAX_VALUE, "byte");
    if (target == double.class || target == Double.class) return number(json).doubleValue();
    if (target == float.class || target == Float.class) return number(json).floatValue();
    if (target == boolean.class || target == Boolean.class) {
      if (json instanceof Boolean) return json;
      throw mismatch(json, "boolean");
    }
    if (target == char.class || target == Character.class) {
      if (json instanceof String && ((String) json).length() == 1) return ((String) json).charAt(0);
      throw mismatch(json, "char");
    }
    if (target == String.class) {
      if (json instanceof String) return json;
      throw mismatch(json, "String");
    }
    if (target.isArray()) {
      Class<?> component = target.getComponentType();
      // 문자열 → char[] (격자 한 줄을 char[]로 받고 싶을 때)
      if (component == char.class && json instanceof String) return ((String) json).toCharArray();
      List<?> list = list(json, target.getSimpleName());
      Object array = Array.newInstance(component, list.size());
      for (int i = 0; i < list.size(); i++) Array.set(array, i, fromJson(list.get(i), component));
      return array;
    }
    if (Collection.class.isAssignableFrom(target) || Map.class.isAssignableFrom(target)) {
      return raw(json, target);
    }
    throw new Runner.UserError("TypeError", target.getSimpleName() + " 타입의 매개변수는 지원하지 않아요");
  }

  /**
   * Object로 받는 값 (예: ["김밥", 3] 같은 섞인 배열을 Object[][]로 받을 때). int 범위 정수는 Integer로 바꿔
   * {@code (int) item[1]}처럼 쓸 수 있게 한다.
   */
  private static Object plain(Object json) {
    if (json instanceof Long) {
      long value = (Long) json;
      return value >= Integer.MIN_VALUE && value <= Integer.MAX_VALUE ? (Object) (int) value : (Object) value;
    }
    if (json instanceof List) {
      List<Object> out = new ArrayList<>();
      for (Object item : (List<?>) json) out.add(plain(item));
      return out;
    }
    return json;
  }

  private static Object generic(Object json, ParameterizedType type) {
    Class<?> raw = (Class<?>) type.getRawType();
    Type[] parts = type.getActualTypeArguments();
    if (Map.class.isAssignableFrom(raw)) {
      if (!(json instanceof Map)) throw mismatch(json, raw.getSimpleName());
      Map<Object, Object> map = raw.isAssignableFrom(LinkedHashMap.class) ? new LinkedHashMap<>() : new HashMap<>();
      for (Map.Entry<?, ?> entry : ((Map<?, ?>) json).entrySet()) {
        Object key = keyFromString((String) entry.getKey(), parts[0]);
        map.put(key, fromJson(entry.getValue(), parts[1]));
      }
      return map;
    }
    if (Collection.class.isAssignableFrom(raw) || raw == Iterable.class) {
      Collection<Object> out = newCollection(raw);
      for (Object item : list(json, raw.getSimpleName())) out.add(fromJson(item, parts[0]));
      return out;
    }
    throw new Runner.UserError("TypeError", raw.getSimpleName() + " 타입의 매개변수는 지원하지 않아요");
  }

  private static Object raw(Object json, Class<?> target) {
    if (Map.class.isAssignableFrom(target)) {
      if (!(json instanceof Map)) throw mismatch(json, target.getSimpleName());
      return new LinkedHashMap<>((Map<?, ?>) json);
    }
    Collection<Object> out = newCollection(target);
    out.addAll(list(json, target.getSimpleName()));
    return out;
  }

  private static Collection<Object> newCollection(Class<?> raw) {
    if (raw.isAssignableFrom(ArrayList.class)) return new ArrayList<>();
    if (raw.isAssignableFrom(LinkedHashSet.class)) return new LinkedHashSet<>();
    if (raw.isAssignableFrom(ArrayDeque.class)) return new ArrayDeque<>();
    if (raw.isAssignableFrom(LinkedList.class)) return new LinkedList<>();
    if (Set.class.isAssignableFrom(raw)) return new HashSet<>();
    if (Deque.class.isAssignableFrom(raw) || Queue.class.isAssignableFrom(raw)) return new ArrayDeque<>();
    return new ArrayList<>();
  }

  private static Object keyFromString(String key, Type type) {
    if (type == Integer.class) return Integer.parseInt(key);
    if (type == Long.class) return Long.parseLong(key);
    return key;
  }

  private static long integer(Object json, long min, long max, String name) {
    if (json instanceof Long) {
      long value = (Long) json;
      if (value < min || value > max) {
        throw new Runner.UserError("TypeError", "값 " + value + "은(는) " + name + " 범위를 넘어요. long을 써 보세요.");
      }
      return value;
    }
    throw mismatch(json, name);
  }

  private static Number number(Object json) {
    if (json instanceof Number) return (Number) json;
    throw mismatch(json, "double");
  }

  private static List<?> list(Object json, String name) {
    if (json instanceof List) return (List<?>) json;
    throw mismatch(json, name);
  }

  private static Runner.UserError mismatch(Object json, String expected) {
    String actual = json == null ? "null" : json instanceof List ? "배열" : json instanceof Map ? "객체" : json.getClass().getSimpleName();
    return new Runner.UserError("TypeError", "입력값(" + actual + ")을 " + expected + " 타입으로 바꿀 수 없어요. 함수 시그니처의 타입을 확인해 주세요.");
  }
}
