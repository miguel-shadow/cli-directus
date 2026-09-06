- [1. Directus CLI](#1-directus-cli)
    - [1.1. Instalar](#11-instalar)
    - [1.2. Desinstalar](#12-desinstalar)


# 1. Directus CLI

*Command Line Interface* de Directus


## 1.1. Instalar

1. **Clonar** y **acceder** al repositorio
1. **Instalar dependencias**:

    ```powershell
    pnpm add --save-exact `
        chalk `
        cli-progress `
        commander `
        inquirer `
        ora `
        zod

    pnpm add --save-exact --save-dev `
        @stylistic/eslint-plugin `
        @types/cli-progress `
        @types/node `
        @typescript-eslint/eslint-plugin `
        @typescript-eslint/parser `
        eslint `
        globals `
        tsc-alias `
        tsx `
        typescript
    ```

    > [!TIP]
    > En entornos *Linux*, **sustituir** `` ` `` por `\`

1. **Compilar**:

    ```bash
    pnpm run build
    ```

1. **Instalar**:
    - *Windows*:

        ```bash
        pnpm add "$pwd" -g
        ```

1. **Utilizar**:

    ```bash
    directus
    ```


## 1.2. Desinstalar

Para desinstalar, ejecutar el comando:

```bash
pnpm remove cli-directus -g
```
