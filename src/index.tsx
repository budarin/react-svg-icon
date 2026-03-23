import type { SVGProps } from 'react';

import { useEffect } from 'react';

let DEFAULT_ICON_SIZE: number | string = 24;
let DEFAULT_ERROR_HANDLER: ((error: Error, iconUrl: string) => void) | null =
    null;

const loadedIcons = new Set<string>();
const SPRITE_ID = '@budarin/svg-sprite-container';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SPRITE_STYLE =
    'position: absolute; width: 0; height: 0; overflow: hidden;';

interface IconProps extends SVGProps<SVGSVGElement> {
    url: string;
    size?: number | string | undefined;
}

export function setDefaultIconSize(size: number | string) {
    DEFAULT_ICON_SIZE = size;
}

export function setDefaultErrorHandler(
    handler: (error: Error, iconUrl: string) => void
) {
    DEFAULT_ERROR_HANDLER = handler;
}

export function SvgIcon({
    url,
    size = DEFAULT_ICON_SIZE,
    ...props
}: IconProps) {
    const name = url;

    useEffect(() => {
        if (loadedIcons.has(name)) {
            return;
        }

        loadedIcons.add(name);

        let sprite = document.getElementById(SPRITE_ID) as SVGSVGElement | null;

        if (!sprite) {
            sprite = document.createElementNS(
                SVG_NAMESPACE,
                'svg'
            ) as SVGSVGElement;
            sprite.id = SPRITE_ID;
            sprite.style = SPRITE_STYLE;
            sprite.setAttribute('aria-hidden', 'true');
            sprite.setAttribute('xmlns', SVG_NAMESPACE);

            const defs = document.createElementNS(SVG_NAMESPACE, 'defs');
            sprite.appendChild(defs);

            document.body.insertBefore(sprite, document.body.firstChild);
        }

        fetch(url)
            .then((response: Response) => {
                // Проверка HTTP статуса
                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                // Проверка Content-Type
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.match(/svg|xml/i)) {
                    throw new Error(
                        `Ожидался SVG/XML, но получен "${contentType}" для ${url}`
                    );
                }

                return response.text();
            })
            .then((svgText: string) => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

                // Проверка на ошибки парсинга
                const parserError = svgDoc.querySelector('parsererror');
                if (parserError) {
                    throw new Error(
                        `Ошибка парсинга SVG: ${parserError.textContent}`
                    );
                }

                const svgElement = svgDoc.querySelector('svg');
                if (!svgElement) {
                    throw new Error(`<svg> элемент не найден в ${url}`);
                }

                const symbol = document.createElementNS(
                    SVG_NAMESPACE,
                    'symbol'
                );

                symbol.id = name;
                symbol.setAttribute('fill', 'currentColor');

                const viewBox = svgElement.getAttribute('viewBox');
                if (viewBox) {
                    symbol.setAttribute('viewBox', viewBox);
                }

                while (svgElement.firstChild) {
                    symbol.appendChild(svgElement.firstChild);
                }

                const defs = sprite?.querySelector('defs');
                defs?.appendChild(symbol);
            })
            .catch((error: Error) => {
                if (DEFAULT_ERROR_HANDLER) {
                    DEFAULT_ERROR_HANDLER(error, url);
                } else {
                    console.error(`Не удалось загрузить иконку ${url}:`, error);
                }
            })
            .finally(() => {
                loadedIcons.delete(name);
            });
    }, [name, url]);

    return (
        <svg aria-hidden="true" width={size} height={size} {...props}>
            <use href={`#${name}`} />
        </svg>
    );
}
