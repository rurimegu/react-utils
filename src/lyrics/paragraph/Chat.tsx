import { CSSProperties, forwardRef, useMemo } from 'react';
import { LyricsParaProps, registerLyricsPara } from './registry';
import { z } from 'zod';
import { Color, LightColor, LyricsBlock, UniqueBy } from '@rurino/core';
import { getGradientColorOrDefault } from '../../utils/web';
import clsx from 'clsx';

const OptionsType = z
  .object({
    avatarSize: z.number().default(48),
    dotsClassName: z.string().default('text-2xl font-bold'),
  })
  .strict();
type OptionsType = z.infer<typeof OptionsType>;

const AVATARS = {
  かすみ: 'https://files.rurino.dev/images/nijigasaki/kasumi.jpg',
  璃奈: 'https://files.rurino.dev/images/nijigasaki/rina.jpg',
  愛: 'https://files.rurino.dev/images/nijigasaki/ai.jpg',
  エマ: 'https://files.rurino.dev/images/nijigasaki/emma.jpg',
  果林: 'https://files.rurino.dev/images/nijigasaki/karin.jpg',
  せつ菜: 'https://files.rurino.dev/images/nijigasaki/setsuna.jpg',
  しずく: 'https://files.rurino.dev/images/nijigasaki/shizuku.jpg',
  彼方: 'https://files.rurino.dev/images/nijigasaki/kanata.jpg',
  ミア: 'https://files.rurino.dev/images/nijigasaki/mia.jpg',
  嵐珠: 'https://files.rurino.dev/images/nijigasaki/raku.jpg',
  栞子: 'https://files.rurino.dev/images/nijigasaki/shioriko.jpg',
  歩夢: 'https://files.rurino.dev/images/nijigasaki/ayumu.jpg',
  default: 'https://files.rurino.dev/images/nijigasaki/nijigasaki.jpg',
};
const DEFAULT_GRAY = Color.FromHex('7f7f7f')!;
const DEFAULT_COLOR = Color.FromHex('F8B656')!;
const MIN_BRIGHTNESS = 0.9;

const ChatPara = forwardRef(function (
  { data, ratios, children, renderer, options }: LyricsParaProps<OptionsType>,
  ref: React.Ref<HTMLDivElement>,
) {
  const [color, dimColor, avatar] = useMemo(() => {
    const tags = data
      .flatMap((d) => d.lyrics.children)
      .map((c) => c.origin)
      .filter((c) => c)
      .flatMap((c) => c!.tags.values);
    const key = Object.keys(AVATARS).find((name) =>
      tags.some((t) => t.name.includes(name)),
    );
    if (key) {
      const tag = tags.find((t) => t.name.includes(key))!;
      const dimColor = LightColor(tag.color, MIN_BRIGHTNESS);
      return [
        tag.color.hex,
        dimColor.hex,
        AVATARS[key as keyof typeof AVATARS],
      ];
    }
    if (data.map((d) => d.lyrics).every((l) => l.isEmpty)) {
      return ['', LightColor(DEFAULT_GRAY, MIN_BRIGHTNESS).hex, ''];
    }
    // Create a gradient from all the colors
    const colors = UniqueBy(
      LyricsBlock.tagsStore.tagList.map((c) => c.color),
      (c) => c.hex,
    ).map((c) => LightColor(c, MIN_BRIGHTNESS));
    const gradient = getGradientColorOrDefault('120deg', colors, [
      DEFAULT_COLOR,
    ]);
    return [DEFAULT_COLOR.hex, gradient, AVATARS.default];
  }, [data]);

  const bgStyle = useMemo<CSSProperties>(() => {
    if (dimColor.startsWith('#')) {
      return {
        background: dimColor,
      };
    }
    return {
      backgroundImage: dimColor,
    };
  }, [dimColor]);

  // Display dots
  const dotsCount =
    ratios[0] > 1 || ratios[0] < 0 ? 0 : (Math.floor(ratios[0] * 6) % 3) + 1;

  const mainDiv = (
    <div ref={ref} className="flex flex-row space-x-2">
      {avatar ? (
        <div
          className="rounded-full bg-cover border-2 border-solid"
          style={{
            width: options.avatarSize,
            height: options.avatarSize,
            backgroundImage: `url(${avatar})`,
            borderColor: color,
          }}
        ></div>
      ) : (
        <div
          className="m-0.5"
          style={{ width: options.avatarSize, height: options.avatarSize }}
        ></div>
      )}
      <div
        className={clsx(
          'bg-opacity-100 flex-grow rounded-xl rounded-tl-sm px-4 py-2 ',
          'flex flex-col justify-center relative',
        )}
        style={bgStyle}
      >
        <div className={ratios[0] >= 1 ? 'visible' : 'invisible'}>
          {children}
        </div>
        <div
          className={clsx(
            'absolute top-0 bottom-0 left-4 flex justify-start items-center',
            options.dotsClassName,
          )}
        >
          {'·'.repeat(dotsCount)}
        </div>
      </div>
    </div>
  );
  return renderer ? renderer(data, mainDiv, false) : mainDiv;
});
ChatPara.displayName = 'ChatPara';

export default ChatPara;

registerLyricsPara('Chat', ChatPara, OptionsType, (data, options) => {
  return {
    preloadSecs: 3,
    durationSecs: data.end - data.start,
    delaySecs: 0,
  };
});
