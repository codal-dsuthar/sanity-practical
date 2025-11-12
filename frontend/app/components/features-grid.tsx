import { Bell, Check, Heart, Star, User } from "lucide-react";
import type React from "react";

export type FeatureItem = {
  _key?: string;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

export type FeaturesGrid = {
  _key?: string;
  _type?: string;
  heading?: string | null;
  subheading?: string | null;
  features?: FeatureItem[] | null;
};

type FeaturesGridProps = {
  block: FeaturesGrid;
  index?: number;
};

function getIconComponent(iconName?: string) {
  if (!iconName) {
    return null;
  }

  const ICONS: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    Check,
    Star,
    User,
    Bell,
    Heart,
  };

  return ICONS[iconName] ?? null;
}

export default function FeaturesGridComponent({ block }: FeaturesGridProps) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:text-center">
          {block?.heading && (
            <h2 className="font-bold text-3xl text-black tracking-tight sm:text-4xl">
              {block.heading}
            </h2>
          )}
          {block?.subheading && (
            <p className="mt-6 text-gray-600 text-lg leading-8">
              {block.subheading}
            </p>
          )}
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {block?.features?.map(
              (feature: FeatureItem | null | undefined, idx: number) => {
                const IconComponent = getIconComponent(
                  feature?.icon ?? undefined
                );

                return (
                  <div className="flex flex-col" key={feature?.title ?? idx}>
                    <dt className="flex items-center gap-x-3 font-semibold text-black text-lg leading-7">
                      {IconComponent && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                          <IconComponent
                            aria-hidden="true"
                            className="h-6 w-6 text-white"
                          />
                        </div>
                      )}
                      {feature?.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base text-gray-600 leading-7">
                      <p className="flex-auto">{feature?.description}</p>
                    </dd>
                  </div>
                );
              }
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
