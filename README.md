# @budarin/react-svg-icon

React компонент для переиспользуемых SVG иконок с автоматической загрузкой и кэшированием.

## Установка

```bash
npm install @budarin/react-svg-icon
# или
pnpm add @budarin/react-svg-icon
# или
yarn add @budarin/react-svg-icon
```

## Использование

```tsx
import { SvgIcon } from '@budarin/react-svg-icon';

function App() {
    return (
        <div>
            <SvgIcon url="/icons/home.svg" size={32} className="my-icon" />
            <SvgIcon
                url="https://example.com/icons/user.svg"
                fill="currentColor"
            />
        </div>
    );
}
```

## API

### SvgIcon

Компонент для отображения SVG иконок.

#### Props

| Prop       | Тип                       | Обязательный | По умолчанию | Описание                    |
| ---------- | ------------------------- | ------------ | ------------ | --------------------------- |
| `url`      | `string`                  | ✅           | -            | URL к SVG файлу             |
| `size`     | `number \| string`        | ❌           | 24           | Размер иконки (например: `24`, `1.5rem`, `100%`) |
| `...props` | `SVGProps<SVGSVGElement>` | ❌           | -            | Дополнительные SVG атрибуты |

### setDefaultIconSize

Функция для изменения размера иконки по умолчанию глобально:

```tsx
import { setDefaultIconSize } from '@budarin/react-svg-icon';

setDefaultIconSize(32); // изменить размер по умолчанию для всех иконок
setDefaultIconSize('1.5rem'); // CSS-значение тоже поддерживается
```

### setDefaultErrorHandler

Функция для установки глобального обработчика ошибок загрузки иконок:

```tsx
import { setDefaultErrorHandler } from '@budarin/react-svg-icon';

// Установить один раз в начале приложения (например, в index.tsx или App.tsx)
setDefaultErrorHandler((error, iconUrl) => {
    console.error(`Не удалось загрузить иконку ${iconUrl}:`, error);
    // Можно отправить в систему мониторинга (Sentry, LogRocket и т.д.)
    // Можно показать уведомление пользователю
    // Можно записать в аналитику
});
```

**Преимущества:**

- Настраивается один раз для всего приложения
- Не нужно добавлять `onError` к каждой иконке
- Единая точка для обработки всех ошибок загрузки
- Удобно для интеграции с системами мониторинга

#### Примеры

**Базовое использование:**

```tsx
<SvgIcon url="/icons/search.svg" />
```

**Кастомным размером:**

```tsx
<SvgIcon url="/icons/heart.svg" size={48} />
```

**Дополнительными атрибутами:**

```tsx
<SvgIcon
    url="/icons/star.svg"
    size={20}
    fill="gold"
    stroke="orange"
    strokeWidth={2}
    className="star-icon"
/>
```

### Фабрика иконок

На базе пакета можно создавать собственные фабрики иконок, чтобы централизованно задавать
размеры, стили и имя компонента.

```tsx
import type { CSSProperties, FC, SVGProps } from 'react';

import { SvgIcon } from '@budarin/react-svg-icon';

type CreateSvgIconParams = {
    url: unknown;
    size?: number;
    defaultStyle?: CSSProperties;
    displayName?: string;
};

const BASE_FONT_SIZE = 16;

export const createSvgIcon = ({
    url,
    size,
    defaultStyle,
    displayName,
}: CreateSvgIconParams): FC<SVGProps<SVGSVGElement>> => {
    const IconComponent: FC<SVGProps<SVGSVGElement>> = ({ style, ...props }) => {
        if (typeof url !== 'string') {
            throw new TypeError('createSvgIcon: url must be a string');
        }

        const sizeInRem =
            typeof size === 'number' ? `${size / BASE_FONT_SIZE}rem` : undefined;

        const sizeStyle: CSSProperties | undefined = sizeInRem
            ? {
                  blockSize: sizeInRem,
                  inlineSize: sizeInRem,
              }
            : undefined;

        const mergedStyle =
            sizeStyle || defaultStyle || style
                ? { ...sizeStyle, ...defaultStyle, ...style }
                : undefined;

        return <SvgIcon {...props} url={url} style={mergedStyle} />;
    };

    if (displayName) {
        IconComponent.displayName = displayName;
    }

    return IconComponent;
};
```


## Особенности

- **Автоматическая загрузка**: Иконки загружаются только при первом использовании
- **Кэширование**: Загруженные иконки сохраняются в DOM и не загружаются повторно
- **SVG Sprite**: Использует SVG sprite для оптимизации производительности
- **Глобальная обработка ошибок**: Настройте обработчик один раз для всех иконок с помощью `setDefaultErrorHandler`
- **currentColor**: По умолчанию иконки используют `fill="currentColor"` для наследования цвета от родителя
- **Доступность**: Иконки помечены `aria-hidden="true"` для улучшения accessibility
- **TypeScript**: Полная поддержка TypeScript с типизацией
- **React 18+**: Совместимость с React 18 и выше

## Требования

- React >= 18.3.1
- React DOM >= 18.3.1

## Лицензия

MIT
