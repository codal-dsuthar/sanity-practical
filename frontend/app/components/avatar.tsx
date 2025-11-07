import { Image } from "next-sanity/image";
import DateComponent from "@/app/components/Date";
import { urlForImage } from "@/sanity/lib/utils";
import type { Person } from "@/sanity.types";

type Props = {
  person?: Partial<Person> & { picture?: Person["picture"] | null };
  date?: string;
  small?: boolean;
};

export default function Avatar({ person, date, small = false }: Props) {
  const firstName = person?.firstName ?? null;
  const lastName = person?.lastName ?? null;
  const picture = person?.picture ?? null;

  function AvatarImage({ img, smallFlag }: { img: Person["picture"] | null | undefined; smallFlag: boolean }) {
    if (!img?.asset?._ref) {
      return null;
    }

    const builder = urlForImage(img);
    const src = (builder?.height(smallFlag ? 64 : 96).width(smallFlag ? 64 : 96).auto("format").url() as string) ?? "";

    return (
      <div className={`${smallFlag ? "mr-2 h-6 w-6" : "mr-4 h-9 w-9"}`}>
        <Image
          alt={img?.alt ?? ""}
          className="h-full rounded-full object-cover"
          height={smallFlag ? 32 : 48}
          src={src}
          width={smallFlag ? 32 : 48}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center font-mono">
      {picture?.asset?._ref ? (
        <AvatarImage img={picture} smallFlag={small} />
      ) : (
        <div className="mr-1">By </div>
      )}
      <div className="flex flex-col">
        {firstName && lastName && (
          <div className={`font-bold ${small ? "text-sm" : ""}`}>
            {firstName} {lastName}
          </div>
        )}
        <div className={`text-gray-500 ${small ? "text-xs" : "text-sm"}`}>
          <DateComponent dateString={date} />
        </div>
      </div>
    </div>
  );
}
