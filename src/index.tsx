import type { SVGProps } from 'react';

import { useEffect } from 'react';

let DEFAULT_ICON_SIZE = 24;
let DEFAULT_ERROR_HANDLER: ((error: Error, iconUrl: string) => void) | null =
    null;

const loadedIcons = new Set<string>();
const SPRITE_ID = '@budarin/svg-sprite-container';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SPRITE_STYLE =
    'position: absolute; width: 0; height: 0; overflow: hidden;';

interface IconProps extends SVGProps<SVGSVGElement> {
    url: string;
    size?: number | undefined;
}

export function setDefaultIconSize(size: number) {
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
            .then((response: Response) => response.text())
            .then((svgText: string) => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');

                if (svgElement) {
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
                }
            })
            .catch((error: Error) => {
                if (DEFAULT_ERROR_HANDLER) {
                    DEFAULT_ERROR_HANDLER(error, url);
                } else {
                    console.error(`Failed to load icon ${url}:`, error);
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
