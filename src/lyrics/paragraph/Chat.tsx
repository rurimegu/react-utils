import { forwardRef, useMemo } from 'react';
import { LyricsParaProps, registerLyricsPara } from './registry';
import { z } from 'zod';
import { Color, LightColor } from '@rurino/core';

const OptionsType = z
  .object({
    avatarSize: z.number().default(48),
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

const ChatPara = forwardRef(function (
  { data, children, renderer, options }: LyricsParaProps<OptionsType>,
  ref: React.Ref<HTMLDivElement>,
) {
  const [color, avatar] = useMemo(() => {
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
      return [tag.color, AVATARS[key as keyof typeof AVATARS]];
    }
    return [Color.FromHex('7f7f7f')!, AVATARS.default];
  }, [data]);

  const dimColor = LightColor(color, 0.9) as Color;

  const mainDiv = (
    <div ref={ref} className="flex flex-row space-x-2">
      <div
        className="rounded-full bg-cover border-2 border-solid"
        style={{
          width: options.avatarSize,
          height: options.avatarSize,
          backgroundImage: `url(${avatar})`,
          borderColor: color?.hex,
        }}
      ></div>
      <div
        className="flex-grow rounded-xl rounded-tl-sm px-4 py-2 flex flex-col justify-center"
        style={{
          backgroundColor: dimColor.hex,
        }}
      >
        {children}
      </div>
    </div>
  );
  return renderer ? renderer(data, mainDiv, false) : mainDiv;
});
ChatPara.displayName = 'ChatPara';

export default ChatPara;

registerLyricsPara('Chat', ChatPara, OptionsType);
