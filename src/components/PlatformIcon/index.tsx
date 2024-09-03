import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandChrome,
  IconBrandMiniprogram,
  IconApps,
  IconProps,
} from "@tabler/icons-react";

export type TablerIconsProps = Partial<
  React.ForwardRefExoticComponent<
    Omit<IconProps, "ref"> &
      React.RefAttributes<React.FunctionComponent<IconProps>>
  >
> & {
  className?: string;
  size?: string | number;
  stroke?: string | number;
  strokeWidth?: string | number;
  style?: React.CSSProperties;
};

type PlatformIconProps = {
  value: string | null;
} & TablerIconsProps;

const PlatformIcon = ({ value, ...iconProps }: PlatformIconProps) => {
  const platformName = value?.toUpperCase();

  switch (platformName) {
    case "ANDROID":
      return <IconBrandAndroid {...iconProps} />;

    case "IOS":
      return <IconBrandApple {...iconProps} />;

    case "WEB":
      return <IconBrandChrome {...iconProps} />;

    case "MINIPROGRAM":
      return <IconBrandMiniprogram {...iconProps} />;

    default:
      return <IconApps {...iconProps} />;
  }
};

export default PlatformIcon;
