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
| `size`     | `number`                  | ❌           | `24`         | Размер иконки в пикселях    |
| `...props` | `SVGProps<SVGSVGElement>` | ❌           | -            | Дополнительные SVG атрибуты |

#### Примеры

**Базовое использование:**

```tsx
<SvgIcon url="/icons/search.svg" />
```

**С кастомным размером:**

```tsx
<SvgIcon url="/icons/heart.svg" size={48} />
```

**С дополнительными атрибутами:**

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

## Особенности

- **Автоматическая загрузка**: Иконки загружаются только при первом использовании
- **Кэширование**: Загруженные иконки сохраняются в DOM и не загружаются повторно
- **SVG Sprite**: Использует SVG sprite для оптимизации производительности
- **TypeScript**: Полная поддержка TypeScript с типизацией
- **React 18+**: Совместимость с React 18 и выше

## Требования

- React >= 18.3.1
- React DOM >= 18.3.1

## Лицензия

MIT
