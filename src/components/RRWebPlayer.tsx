import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import rrwebPlayer from '@appsurify-testmap/rrweb-player';
import type {
    eventWithTime,
} from '@appsurify-testmap/rrweb-types';
import {
    Box
} from '@chakra-ui/react';


interface Props {
  events: eventWithTime[];
}

export interface RRWebPlayerRef {
  seekToAction: (actionId: number) => void;
  seekToTimestamp: (timestamp: number) => void;
  highlightNode: (nodeId: number, color?: string) => void;
  clearHighlight: (nodeId: number) => void;
  getMetaData: () => ReturnType<rrwebPlayer['getMetaData']> | undefined;
  getMirror: () => ReturnType<rrwebPlayer['getMirror']> | undefined;
}

const RRWebPlayer = forwardRef<RRWebPlayerRef, Props>(({events}, ref) => {
    const playerElRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<rrwebPlayer | null>(null);

    useEffect(() => {
        if (!playerElRef.current || events.length === 0) return;

        playerElRef.current.innerHTML = ''

        playerRef.current = new rrwebPlayer({
          target: playerElRef.current!,
          props: {
              // @ts-ignore
              events: events,
              autoPlay: false,
              showController: true,
              width: 640,
              height: 480,
              mouseTail: false,
              pauseAnimation: true,
              useVirtualDom: true,

          },
        });

        return () => {
            playerRef.current?.pause();
            playerRef.current?.getReplayer().destroy();
        };
    }, [events]);

    // Публичные методы
    useImperativeHandle(ref, () => ({
        seekToAction(actionId: number) {
            const event = events.find((e: any) => e.id === actionId);
            const startTime = this.getMetaData()?.startTime;
            if (event && playerRef.current && startTime) {
                playerRef.current.goto(event.timestamp - startTime + 1);
            }
        },

        seekToTimestamp(timestamp: number) {
            const startTime = this.getMetaData()?.startTime;
            if (playerRef.current && startTime) {
                playerRef.current.goto(timestamp - startTime + 1);
            }
        },

        highlightNode(nodeId: number, color = 'rgba(255, 0, 0, 0.3)') {
            const mirror = playerRef.current?.getMirror();
            const el = mirror?.getNode(nodeId) as HTMLElement | null;

            if (el) {
                el.style.outline = `2px solid ${color}`;
                el.style.backgroundColor = color;
            }
        },

        clearHighlight(nodeId: number) {
            const mirror = playerRef.current?.getMirror();
            const el = mirror?.getNode(nodeId) as HTMLElement | null;

            if (el) {
                el.style.outline = '';
                el.style.backgroundColor = '';
            }
        },

        getMetaData: () => playerRef.current?.getMetaData(),

        getMirror: () => playerRef.current?.getMirror(),
    }));

    return (
        <Box ref={playerElRef} minH="400px" mb={4} />
    )
});

export default RRWebPlayer;
