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
| `size`     | `number`                  | ❌           | 24           | Размер иконки в пикселях    |
| `...props` | `SVGProps<SVGSVGElement>` | ❌           | -            | Дополнительные SVG атрибуты |

### setDefaultIconSize

Функция для изменения размера иконки по умолчанию глобально:

```tsx
import { setDefaultIconSize } from '@budarin/react-svg-icon';

setDefaultIconSize(32); // изменить размер по умолчанию для всех иконок
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

**Глобальной обработкой ошибок:**

```tsx
// В index.tsx или App.tsx
import { setDefaultErrorHandler } from '@budarin/react-svg-icon';

setDefaultErrorHandler((error, iconUrl) => {
    // Ваша логика обработки ошибок для всех иконок
    console.error(`Ошибка загрузки: ${iconUrl}`, error);
});

// Теперь все иконки автоматически используют этот обработчик
<SvgIcon url="/icons/user.svg" />
<SvgIcon url="/icons/settings.svg" />
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
