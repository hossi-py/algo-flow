# public/java

- `algoflow-runner.jar` — algo-flow의 Java 채점 하네스. 소스는 `java-runtime/src/algoflow`, 빌드는 `pnpm build:java`.
- `ecj.jar` — Eclipse Compiler for Java (ECJ) 3.26.0, `org.eclipse.jdt:ecj:3.26.0` (Maven Central) 그대로.
  Eclipse Public License 2.0 (https://www.eclipse.org/legal/epl-2.0/) 에 따라 배포되며, 소스는
  https://github.com/eclipse-jdt/eclipse.jdt.core 에서 받을 수 있다. 수정하지 않았다.

브라우저에서는 CheerpJ(https://cheerpj.com, Leaning Technologies)가 이 jar들을 실행한다. CheerpJ 런타임은
저장소에 포함하지 않고 CDN에서 불러오며, 상업 서비스로 운영하려면 CheerpJ 라이선스가 필요하다.
