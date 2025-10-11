import type { SVGProps } from 'react';
import { useEffect, useRef } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
    name: string;
    url: string;
    size?: number;
}

const SPRITE_ID = '@budarin/svg-sprite-container';
const loadedIcons = new Set<string>();

export function Icon({ name, url, size = 24, ...props }: IconProps) {
    const loadingRef = useRef<boolean>(false);

    useEffect(() => {
        let sprite = document.getElementById(SPRITE_ID) as SVGSVGElement | null;

        if (!sprite) {
            sprite = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
            ) as SVGSVGElement;
            sprite.id = SPRITE_ID;
            sprite.style.display = 'none';
            sprite.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            const defs = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'defs'
            );
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
                            'http://www.w3.org/2000/svg',
                            'symbol'
                        );
                        symbol.id = `icon-${name}`;

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
        <svg width={size} height={size} {...props}>
            <use href={`#icon-${name}`} />
        </svg>
    );
}
