import { Image } from "next-sanity/image";
import DateComponent from "@/app/components/date";
import { getAuthorNames } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/utils";
import type { Person } from "@/sanity.types";

type Props = {
  person?: Partial<Person> & { headshotImage?: Person["headshotImage"] | null };
  date?: string;
  small?: boolean;
};

export default function Avatar({ person, date, small = false }: Props) {
  // Use utility function to get names, falling back to splitting full name if needed
  const { firstName, lastName } = person
    ? getAuthorNames({
        firstName: person.firstName ?? null,
        lastName: person.lastName ?? null,
      })
    : { firstName: "", lastName: "" };
  const headshotImage = person?.headshotImage ?? null;

  function AvatarImage({
    img,
    smallFlag,
  }: {
    img: Person["headshotImage"] | null | undefined;
    smallFlag: boolean;
  }) {
    if (!img?.asset?._ref) {
      return null;
    }

    const builder = urlForImage(img);
    const src =
      (builder
        ?.height(smallFlag ? 64 : 96)
        .width(smallFlag ? 64 : 96)
        .auto("format")
        .url() as string) ?? "";

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
      {headshotImage?.asset?._ref ? (
        <AvatarImage img={headshotImage} smallFlag={small} />
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
