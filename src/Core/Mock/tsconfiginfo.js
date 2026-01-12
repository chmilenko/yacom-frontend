export const ts = {
  compilerOptions: {
    // === Базовые настройки ===
    target: "es2015",
    // В какую версию ECMAScript компилировать код.
    // es2015 = ES6 (поддерживает промисы, классы, стрелочные функции).
    // Для мобильных приложений 1С это безопасный выбор.

    lib: ["dom", "dom.iterable", "esnext"],
    // Какие типы стандартных библиотек подключать:
    // - "dom" для работы с DOM (document, window)
    // - "dom.iterable" для итерации по DOM-коллекциям
    // - "esnext" для современных возможностей JavaScript
    // Важно: НЕ включайте "webworker" и т.п. — они не нужны в 1С.

    // === Совместимость с существующим JS-кодом ===
    allowJs: true,
    // Разрешить импорт .js/.jsx файлов в .ts/.tsx проекте.
    // КРИТИЧЕСКИ важно для постепенной миграции!

    skipLibCheck: true,
    // Не проверять типы в файлах деклараций (*.d.ts) из node_modules.
    // Ускоряет компиляцию, безопасно для React.

    // === Система модулей ===
    module: "esnext",
    // Формат модулей на выходе: "esnext" = современные ES-модули.
    // React-сборщики (Webpack/Vite) понимают этот формат.

    moduleResolution: "node",
    // Как искать модули: как в Node.js (в node_modules, по package.json).
    // Для React-проектов — единственно правильный вариант.

    // === Интероперабельность ===
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    // Эти два поля РАЗРЕШАТ импорт CommonJS-модулей (как require)
    // через синтаксис ES-модулей (import).
    // Без этого не заработает: import React from 'react'
    // (т.к. React — CommonJS-библиотека).

    resolveJsonModule: true,
    // Позволяет импортировать JSON-файлы как модули:
    // import config from './config.json'

    // === Строгость проверки типов ===
    strict: true,
    // ВКЛЮЧАЕТ ВСЕ СТРОГИЕ ПРОВЕРКИ ТИПОВ:
    // - noImplicitAny
    // - strictNullChecks
    // - strictFunctionTypes
    // - strictBindCallApply
    // - strictPropertyInitialization
    // - noImplicitThis
    // - alwaysStrict
    // Начинать можно с false, но для качества кода лучше true.

    forceConsistentCasingInFileNames: true,
    // Запрещает разный регистр в путях импорта.
    // На Windows/Linux это важно (файловая система Windows нечувствительна к регистру).

    noFallthroughCasesInSwitch: true,
    // Запрещает "проваливание" в switch-case без break/return.
    // Уменьшает ошибки.

    // === JSX ===
    jsx: "react-jsx",
    // Как обрабатывать JSX:
    // "react-jsx" = новый трансформер JSX (React 17+)
    // Если React 16 или ниже — используйте "react"

    // === Пути и выходные файлы ===
    baseUrl: "src",
    // Базовый путь для абсолютных импортов.
    // Вместо: import { ... } from '../../../components'
    // Можно: import { ... } from 'components'
    // (если папка src/components)

    outDir: "./dist",
    // Куда складывать скомпилированные .js файлы.
    // Но! В React-проектах обычно НЕ используют tsc для сборки,
    // а используют Webpack/Vite. Это запасной вариант.

    noEmit: false,
    // false = разрешить генерацию .js файлов.
    // Для разработки можно поставить true (только проверка типов),
    // чтобы не засорять папки.

    isolatedModules: true,
    // Требует, чтобы каждый файл был независимым модулем.
    // Обязательно для работы с Babel и современными сборщиками.
  },

  // === Какие файлы компилировать ===
  include: ["src/**/*"],
  // Обрабатывать все файлы в папке src и её подпапках

  exclude: ["node_modules", "dist"],
  // Игнорировать папки с зависимостями и сборкой
};
