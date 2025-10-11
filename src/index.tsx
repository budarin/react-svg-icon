import type { SVGProps } from 'react';

import { useEffect, useRef } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
    url: string;
    size?: number | undefined;
}

const DEFAULT_SIZE = 24;
const loadedIcons = new Set<string>();
const SPRITE_ID = '@budarin/svg-sprite-container';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SPRITE_STYLE =
    'position: absolute; width: 0; height: 0; overflow: hidden;';

export function SvgIcon({ url, size = DEFAULT_SIZE, ...props }: IconProps) {
    const name = url;
    const loadingRef = useRef<boolean>(false);

    useEffect(() => {
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

        if (!loadedIcons.has(name) && !loadingRef.current) {
            loadingRef.current = true;

            fetch(url)
                .then((response: Response) => response.text())
                .then((svgText: string) => {
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(
                        svgText,
                        'image/svg+xml'
                    );
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
                        loadedIcons.add(name);
                    }
                })
                .catch((error: Error) => {
                    console.error(`Failed to load icon ${name}:`, error);
                })
                .finally(() => {
                    loadingRef.current = false;
                });
        }
    }, [name, url]);

    return (
        <svg aria-hidden="true" width={size} height={size} {...props}>
            <use href={`#${name}`} />
        </svg>
    );
}
