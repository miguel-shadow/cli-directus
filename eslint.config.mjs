import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import typescript from '@typescript-eslint/parser'


/** @type {import('eslint').Linter.Config} */
const config = {
  plugins: {
    '@stylistic': stylistic,
    '@typescript-eslint': tsPlugin,
  },
  languageOptions: {
    globals: {
      ...globals.node,
      NodeJS: 'readonly',
    },
    parser: typescript,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
      project: './tsconfig.json',
    },
  },
  files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
  ignores: ['node_modules/**/*', 'build/**/*', 'dist/**/*', 'src/**/*.test.ts'],
  rules: {
    // ESLint
    'accessor-pairs': [
      'warn',
      {
        enforceForClassMembers: true,
        getWithoutSet: false,
        setWithoutGet: true,
      },
    ],
    'array-callback-return': ['error', { checkForEach: true } ],
    'arrow-body-style': ['warn', 'as-needed', { requireReturnForObjectLiteral: false } ],
    'block-scoped-var': 'error',
    'camelcase': [
      'warn',
      {
        properties: 'never',
        ignoreDestructuring: false,
        ignoreImports: false,
        ignoreGlobals: false,
        allow: [],
      },
    ],
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off',
    'complexity': 'off',
    'consistent-return': ['warn', { treatUndefinedAsUnspecified: false } ],
    'consistent-this': 'off',
    'constructor-super': 'error',
    'curly': ['error', 'all'],
    'default-case-last': 'warn',
    'default-case': ['warn', { commentPattern: '^no\\sdefault$' } ],
    'default-param-last': 'off',
    'dot-notation': 'off',
    'eqeqeq': ['warn', 'smart'],
    'for-direction': 'error',
    'func-name-matching': 'off',
    'func-names': ['warn', 'as-needed'],
    'func-style': ['warn', 'declaration'],
    'getter-return': 'error',
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],
    'guard-for-in': 'off',
    'id-denylist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'init-declarations': 'off',
    'logical-assignment-operators': ['warn', 'always'],
    'max-classes-per-file': 'off',
    'max-depth': ['warn', 5],
    'max-lines-per-function': 'off',
    'max-lines': [
      'warn',
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-nested-callbacks': ['warn', 10],
    'max-params': 'off',
    'max-statements': 'off',
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: true,
        properties: false,
      },
    ],
    'no-alert': 'warn',
    'no-array-constructor': 'off',
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'warn',
    'no-bitwise': 'warn',
    'no-caller': 'error',
    'no-case-declarations': 'off',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': ['error', 'except-parens'],
    'no-console': ['warn', { allow: [ 'error' ] } ],
    'no-const-assign': 'error',
    'no-constant-binary-expression': 'error',
    'no-constant-condition': 'error',
    'no-constructor-return': 'error',
    'no-continue': 'off',
    'no-control-regex': 'warn',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-div-regex': 'warn',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'off',
    'no-dupe-else-if': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'warn',
    'no-empty-character-class': 'warn',
    'no-empty-function': 'off',
    'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: false } ],
    'no-empty-static-block': 'warn',
    'no-empty': ['warn', { allowEmptyCatch: true } ],
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-ex-assign': 'warn',
    'no-extend-native': 'error',
    'no-extra-bind': 'off',
    'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: false } ],
    'no-extra-label': 'error',
    'no-fallthrough': 'warn',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-implicit-coercion': [
      'error',
      {
        boolean: true,
        number: true,
        string: true,
        disallowTemplateShorthand: false,
        allow: [],
      },
    ],
    'no-implicit-globals': 'off',
    'no-implied-eval': 'off',
    'no-import-assign': 'error',
    'no-inline-comments': 'off',
    'no-inner-declarations': ['error', 'functions', { blockScopedFunctions: 'allow' } ],
    'no-invalid-regexp': ['warn', { allowConstructorFlags: [] } ],
    'no-invalid-this': 'off',
    'no-irregular-whitespace': ['error', { skipStrings: true } ],
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'off',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'off',
    'no-loss-of-precision': 'off',
    'no-magic-numbers': 'off',
    'no-misleading-character-class': ['warn', { allowEscape: false } ],
    'no-multi-assign': ['warn', { ignoreNonDeclaration: false } ],
    'no-multi-str': 'error',
    'no-negated-condition': 'off',
    'no-nested-ternary': 'warn',
    'no-new-func': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-new-wrappers': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-obj-calls': 'error',
    'no-object-constructor': 'error',
    'no-octal-escape': 'error',
    'no-octal': 'error',
    'no-param-reassign': ['warn', { props: false } ],
    'no-plusplus': 'off',
    'no-promise-executor-return': 'off',
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': 'off',
    'no-regex-spaces': 'warn',
    'no-restricted-exports': 'off',
    'no-restricted-globals': 'off',
    'no-restricted-imports': 'off',
    'no-restricted-properties': 'off',
    'no-restricted-syntax': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-script-url': 'warn',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': ['error', { allowInParentheses: true } ],
    'no-setter-return': 'error',
    'no-shadow-restricted-names': ['error', { reportGlobalThis: false } ],
    'no-shadow': 'off',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'warn',
    'no-ternary': 'off',
    'no-this-before-super': 'error',
    'no-throw-literal': 'off',
    'no-unassigned-vars': 'off',
    'no-undef-init': 'warn',
    'no-undef': ['error', { typeof: false } ],
    'no-undefined': 'error',
    'no-underscore-dangle': 'off',
    'no-unexpected-multiline': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': ['error', { defaultAssignment: true } ],
    'no-unreachable-loop': ['error', { ignore: [] } ],
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': ['error', { enforceForOrderingRelations: false } ],
    'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: false } ],
    'no-unused-expressions': 'off',
    'no-unused-labels': 'error',
    'no-unused-private-class-members': 'error',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-assignment': 'warn',
    'no-useless-backreference': 'warn',
    'no-useless-call': 'off',
    'no-useless-catch': 'error',
    'no-useless-computed-key': ['error', { enforceForClassMembers: true } ],
    'no-useless-concat': 'error',
    'no-useless-constructor': 'off',
    'no-useless-escape': 'error',
    'no-useless-rename': [
      'error',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': ['error', { allowAsStatement: false } ],
    'no-warning-comments': 'off',
    'no-with': 'error',
    'object-shorthand': [
      'error',
      'always',
      {
        avoidQuotes: false,
        ignoreConstructors: false,
        methodsIgnorePattern: '',
        avoidExplicitReturnArrows: false,
      },
    ],
    'one-var': 'off',
    'operator-assignment': ['error', 'always'],
    'prefer-arrow-callback': [
      'warn',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      },
    ],
    'prefer-const': [
      'warn',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true,
      },
    ],
    'prefer-destructuring': 'off',
    'prefer-exponentiation-operator': 'error',
    'prefer-named-capture-group': 'off',
    'prefer-numeric-literals': 'off',
    'prefer-object-has-own': 'warn',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'off',
    'prefer-regex-literals': ['warn', { disallowRedundantWrapping: true } ],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'warn',
    'radix': ['warn', 'as-needed'],
    'require-atomic-updates': ['warn', { allowProperties: false } ],
    'require-await': 'off',
    'require-unicode-regexp': 'off',
    'require-yield': 'warn',
    'sort-imports': 'off',
    'sort-keys': 'off',
    'sort-vars': 'off',
    'strict': 'off',
    'symbol-description': 'error',
    'unicode-bom': 'off',
    'use-isnan': [
      'error',
      {
        enforceForSwitchCase: true,
        enforceForIndexOf: true,
      },
    ],
    'valid-typeof': ['error', { requireStringLiterals: false } ],
    'vars-on-top': 'off',
    'yoda': [
      'error',
      'never',
      {
        exceptRange: false,
        onlyEquality: false,
      },
    ],


    // ESLint Style
    '@stylistic/array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 5,
      },
    ],
    '@stylistic/array-bracket-spacing': [
      'error',
      'never',
      {
        singleValue: true,
        objectsInArrays: true,
        arraysInArrays: true,
      },
    ],
    '@stylistic/array-element-newline': [
      'error',
      {
        consistent: true,
        multiline: true,
        minItems: 5,
      },
    ],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    '@stylistic/comma-style': ['error', 'last'],
    '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true } ],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-paren-newline': ['error', { minItems: 4 } ],
    '@stylistic/generator-star-spacing': [
      'error',
      {
        before: true,
        after: false,
      },
    ],
    '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
    '@stylistic/jsx-quotes': ['error', 'prefer-double'],
    '@stylistic/line-comment-position': 'off',
    '@stylistic/linebreak-style': 'off',
    '@stylistic/max-len': [
      'warn',
      {
        code: 150,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    '@stylistic/max-statements-per-line': ['warn', { max: 2 } ],
    '@stylistic/multiline-comment-style': ['error', 'separate-lines'],
    '@stylistic/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/new-parens': ['error', 'always'],
    '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 } ],
    '@stylistic/no-confusing-arrow': 'off',
    '@stylistic/no-floating-decimal': 'error',
    '@stylistic/no-mixed-operators': 'off',
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true } ],
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2 } ],
    '@stylistic/no-tabs': ['error', { allowIndentationTabs: false } ],
    '@stylistic/no-trailing-spaces': [
      'error',
      {
        skipBlankLines: false,
        ignoreComments: false,
      },
    ],
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
    '@stylistic/one-var-declaration-per-line': ['error', 'initializations'],
    '@stylistic/operator-linebreak': ['error', 'after'],
    '@stylistic/padded-blocks': 'off',
    '@stylistic/rest-spread-spacing': ['error', 'never'],
    '@stylistic/semi-spacing': 'off',
    '@stylistic/semi-style': ['error', 'first'],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/space-unary-ops': 'error',
    '@stylistic/spaced-comment': ['error', 'always'],
    '@stylistic/switch-colon-spacing': [
      'error',
      {
        after: true,
        before: false,
      },
    ],
    '@stylistic/template-curly-spacing': ['error', 'never'],
    '@stylistic/template-tag-spacing': ['error', 'never'],
    '@stylistic/wrap-iife': ['error', 'inside'],
    '@stylistic/wrap-regex': 'warn',
    '@stylistic/yield-star-spacing': [
      'error',
      {
        before: true,
        after: false,
      },
    ],


    // ESLint TypeScript
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array-simple',
        readonly: 'array-simple',
      },
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-tslint-comment': 'error',
    '@typescript-eslint/class-literal-property-style': 'error',
    '@typescript-eslint/class-methods-use-this': 'off',
    '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    '@typescript-eslint/consistent-return': 'warn',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        arrayLiteralTypeAssertions: 'allow',
        objectLiteralTypeAssertions: 'allow',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: false } ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/default-param-last': 'error', // Deshabilitar regla ESLint default: default-param-last
    '@typescript-eslint/dot-notation': [
      'error',
      {
        allowKeywords: true,
        allowPattern: '^[a-z]+(_[a-z]+)+$',
        allowPrivateClassPropertyAccess: false,
        allowProtectedClassPropertyAccess: false,
        allowIndexSignaturePropertyAccess: true,
      },
    ], // Deshabilitar regla ESLint default: dot-notation
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        allowDirectConstAssertionInArrowFunctions: true,
        allowedNames: [],
        allowExpressions: false,
        allowFunctionsWithoutTypeParameters: false,
        allowHigherOrderFunctions: true,
        allowIIFEs: false,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        accessibility: 'explicit',
        'overrides': { 'constructors': 'no-public' }
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        allowArgumentsExplicitlyTypedAsAny: false,
        allowDirectConstAssertionInArrowFunctions: true,
        allowedNames: [],
        allowHigherOrderFunctions: true,
        allowOverloadFunctions: false,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/max-params': [
      'warn',
      {
        max: 4,
        countVoidThis: false,
      },
    ], // Deshabilitar regla ESLint default: max-params
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        'default': {
          memberTypes: [
            // Index signature
            "signature",
            "call-signature",

            // Static initialization
            'static-initialization',

            // Fields
            "protected-abstract-field",
            "public-abstract-field",

            "private-decorated-field",
            "protected-decorated-field",
            "public-decorated-field",

            "#private-static-field",
            "private-static-field",
            "protected-static-field",
            "public-static-field",

            "#private-instance-field",
            "private-instance-field",
            "protected-instance-field",
            "public-instance-field",

            "#private-field",
            "private-field",
            "protected-field",
            "public-field",

            "abstract-field",
            "static-field",
            "instance-field",

            "decorated-field",

            "field",

            // Static initialization
            "static-initialization",

            // Constructors
            "private-constructor",
            "protected-constructor",
            "public-constructor",

            "constructor",

            // Accessors
            "#private-static-accessor",
            "private-static-accessor",
            "protected-static-accessor",
            "public-static-accessor",

            "private-decorated-accessor",
            "protected-decorated-accessor",
            "public-decorated-accessor",

            "#private-instance-accessor",
            "private-instance-accessor",
            "protected-instance-accessor",
            "public-instance-accessor",

            "protected-abstract-accessor",
            "public-abstract-accessor",

            "#private-accessor",
            "private-accessor",
            "protected-accessor",
            "public-accessor",

            "abstract-accessor",
            "static-accessor",
            "instance-accessor",

            "decorated-accessor",

            "accessor",

            // Methods
            "#private-static-method",
            "private-static-method",
            "protected-static-method",
            "public-static-method",

            "private-decorated-method",
            "protected-decorated-method",
            "public-decorated-method",

            "#private-instance-method",
            "private-instance-method",
            "protected-instance-method",
            "public-instance-method",

            "protected-abstract-method",
            "public-abstract-method",

            "#private-method",
            "private-method",
            "protected-method",
            "public-method",

            "abstract-method",
            "static-method",
            "instance-method",

            "decorated-method",

            "method",
          ],
          optionalityOrder: 'required-first',
          order: 'alphabetically-case-insensitive'
        }
      }
    ],
    '@typescript-eslint/method-signature-style': ['warn', 'property'],
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-array-constructor': 'error', // Deshabilitar regla ESLint default: no-array-constructor
    '@typescript-eslint/no-array-delete': 'error',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      {
        ignoreArrowShorthand: false,
        ignoreVoidOperator: false,
        ignoreVoidReturningFunctions: false,
      },
    ],
    '@typescript-eslint/no-deprecated': 'warn',
    '@typescript-eslint/no-dupe-class-members': 'error', // Deshabilitar regla ESLint default: no-dupe-class-members
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-duplicate-type-constituents': [
      'error',
      {
        ignoreIntersections: false,
        ignoreUnions: false,
      },
    ],
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-empty-function': 'warn', // Deshabilitar regla ESLint default: no-empty-function
    '@typescript-eslint/no-empty-interface': ['warn', { allowSingleExtends: false } ],
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        fixToUnknown: true,
        ignoreRestArgs: false,
      },
    ],
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-floating-promises': [
      'warn',
      {
        allowForKnownSafeCalls: [],
        allowForKnownSafePromises: [],
        checkThenables: false,
        ignoreIIFE: false,
        ignoreVoid: true,
      },
    ],
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error', // Deshabilitar regla ESLint default: no-implied-eval
    '@typescript-eslint/no-import-type-side-effects': 'warn',
    '@typescript-eslint/no-inferrable-types': [
      'warn',
      {
        ignoreParameters: true,
        ignoreProperties: false,
      },
    ],
    '@typescript-eslint/no-invalid-this': ['warn', { capIsConstructor: true } ], // Deshabilitar regla ESLint default: no-invalid-this
    '@typescript-eslint/no-invalid-void-type': [
      'error',
      {
        allowAsThisParameter: false,
        allowInGenericTypeArguments: true,
      },
    ],
    '@typescript-eslint/no-loop-func': 'warn', // Deshabilitar regla ESLint default: no-loop-func
    '@typescript-eslint/no-loss-of-precision': 'warn', // Deshabilitar regla ESLint default: no-loss-of-precision
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-meaningless-void-operator': ['error', { checkNever: false } ],
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksConditionals: true,
        checksSpreads: true,
        checksVoidReturn: true,
      },
    ],
    '@typescript-eslint/no-misused-spread': 'error',
    '@typescript-eslint/no-mixed-enums': 'warn',
    '@typescript-eslint/no-namespace': [
      'warn',
      {
        allowDeclarations: false,
        allowDefinitionFiles: true,
      },
    ],
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true } ], // Deshabilitar regla ESLint default: no-redeclare
    '@typescript-eslint/no-redundant-type-constituents': 'error',
    '@typescript-eslint/no-require-imports': [
      'error',
      {
        allow: [],
        allowAsImport: false,
      },
    ],
    '@typescript-eslint/no-restricted-imports': 'off',
    '@typescript-eslint/no-restricted-types': 'off',
    '@typescript-eslint/no-shadow': [
      'error',
      {
        builtinGlobals: false,
        allow: [],
        hoist: 'functions-and-types',
        ignoreOnInitialization: false,
        ignoreTypeValueShadow: true,
        ignoreFunctionTypeParameterNameValueShadow: true,
      },
    ], // Deshabilitar regla ESLint default: no-shadow
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: true,
        allowedNames: [],
      },
    ],
    '@typescript-eslint/no-type-alias': [
      'off',
      {
        allowAliases: 'never',
        allowCallbacks: 'never',
        allowConditionalTypes: 'never',
        allowConstructors: 'never',
        allowGenerics: 'never',
        allowLiterals: 'never',
        allowMappedTypes: 'never',
        allowTupleTypes: 'never',
      },
    ],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
      'error',
      {
        allowComparingNullableBooleansToFalse: true,
        allowComparingNullableBooleansToTrue: true,
      },
    ],
    '@typescript-eslint/no-unnecessary-condition': [
      'error',
      {
        allowConstantLoopConditions: 'never',
        checkTypePredicates: false,
      },
    ],
    '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-template-expression': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unnecessary-type-conversion': 'error',
    '@typescript-eslint/no-unnecessary-type-parameters': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unsafe-enum-comparison': 'error',
    '@typescript-eslint/no-unsafe-function-type': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-type-assertion': 'warn',
    '@typescript-eslint/no-unsafe-unary-minus': 'error',
    '@typescript-eslint/no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
        enforceForJSX: false,
        ignoreDirectives: false,
      },
    ], // Deshabilitar regla ESLint default: no-unused-expressions
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
        ignoreClassWithStaticInitBlock: false,
        reportUsedIgnorePattern: false,
      },
    ], // Deshabilitar regla ESLint default: no-unused-vars
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
        allowNamedExports: false,
        enums: false,
        typedefs: false,
        ignoreTypeReferences: false,
      },
    ], // Deshabilitar regla ESLint default: no-use-before-define
    '@typescript-eslint/no-useless-constructor': 'warn', // Deshabilitar regla ESLint default: no-useless-constructor
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/no-wrapper-object-types': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/only-throw-error': [
      'error',
      {
        allow: [],
        allowRethrowing: false,
        allowThrowingAny: true,
        allowThrowingUnknown: true,
      },
    ], // Deshabilitar regla ESLint default: no-throw-literal
    '@typescript-eslint/parameter-properties': ['error', { prefer: 'class-property' } ],
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-destructuring': [
      'error',
      {
        array: false,
        object: false,
      },
      { enforceForDeclarationWithTypeAnnotation: false },
    ], // Deshabilitar regla ESLint default: prefer-destructuring
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-find': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: false } ],
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/prefer-optional-chain': [
      'error',
      {
        allowPotentiallyUnsafeFixesThatModifyTheReturnTypeIKnowWhatImDoing: false,
        checkAny: true,
        checkBigInt: true,
        checkBoolean: true,
        checkNumber: true,
        checkString: true,
        checkUnknown: true,
        requireNullish: false,
      },
    ],
    '@typescript-eslint/prefer-promise-reject-errors': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/promise-function-async': [
      'error',
      {
        allowAny: true,
        allowedPromiseNames: [],
        checkArrowFunctions: true,
        checkFunctionDeclarations: true,
        checkFunctionExpressions: true,
        checkMethodDeclarations: true,
      },
    ],
    '@typescript-eslint/related-getter-setter-pairs': 'error',
    '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true } ],
    '@typescript-eslint/require-await': 'warn', // Deshabilitar regla ESLint default: require-await
    '@typescript-eslint/restrict-plus-operands': [
      'error',
      {
        allowAny: true,
        allowBoolean: true,
        allowNullish: true,
        allowNumberAndString: true,
        allowRegExp: true,
        skipCompoundAssignments: false,
      },
    ],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allow: [
          {
            name: ['Error', 'URL', 'URLSearchParams'],
            from: 'lib',
          },
        ],
        allowAny: true,
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
        allowRegExp: true,
      },
    ],
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'warn',
      {
        allowAny: false,
        allowNullableBoolean: false,
        allowNullableEnum: false,
        allowNullableNumber: false,
        allowNullableObject: true,
        allowNullableString: false,
        allowNumber: true,
        allowString: true,
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/unified-signatures': 'off',
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',


    // ESLintTypeScript Style
    '@stylistic/block-spacing': ['error', 'always'],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true } ],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/indent': ['error', 2],
    '@stylistic/key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
      },
    ],
    '@stylistic/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    '@stylistic/lines-around-comment': [
      'error',
      {
        beforeBlockComment: true,
        allowBlockStart: true,
        allowEnumEnd: true,
        allowEnumStart: true,
        allowInterfaceEnd: true,
        allowInterfaceStart: true,
        allowModuleEnd: true,
        allowModuleStart: true,
        allowTypeEnd: true,
        allowTypeStart: true
      },
    ],
    '@stylistic/lines-between-class-members': [
      'error',
      {
        enforce: [
          {
            blankLine: 'always',
            prev: '*',
            next: '*',
          },
          {
            blankLine: 'never',
            prev: 'field',
            next: 'field',
          },
        ],
      },
    ],
    '@stylistic/member-delimiter-style': ['error', {
      "multiline": {
        "delimiter": "none",
        "requireLast": false
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": false
      },
      "multilineDetection": "brackets"
    }],
    '@stylistic/no-extra-parens': ['error', 'all'],
    '@stylistic/no-extra-semi': 'error',
    '@stylistic/object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        TSTypeLiteral: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        TSInterfaceBody: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        TSEnumBody: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
      },

    ],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      }
    ],
    '@stylistic/padding-line-between-statements': 'off',
    '@stylistic/quote-props': ['error', 'consistent-as-needed'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/semi-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    '@stylistic/space-before-blocks': ['error', 'always'],
    '@stylistic/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/type-annotation-spacing': 'error',
  },
}

export default config
