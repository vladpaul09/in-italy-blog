import { FC } from "react";

interface IImageContainer {
  src: string;
  alt: string;
  aspect_ratio: string;
  noLazyLoading?: boolean;
  container_width?: string;
  container_height?: string;
  container_class?: string;
  onClick?: () => void;
}

const ImageContainer: FC<IImageContainer> = ({
  src,
  alt,
  aspect_ratio,
  container_width,
  container_height,
  noLazyLoading,
  container_class,
  onClick,
}) => {
  return (
    <div
      className={container_class}
      style={{
        paddingBottom: aspect_ratio ? aspect_ratio : "75%",
        height: container_height ? container_height : undefined,
        width: container_width ? container_width : undefined,
        cursor: onClick ? "pointer" : undefined,
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      <img
        loading={noLazyLoading ? undefined : "lazy"}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        src={src}
        alt={alt}
      />
    </div>
  );
};

export default ImageContainer;
