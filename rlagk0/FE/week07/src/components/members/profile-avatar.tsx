import { cn } from "@/utils/cn";

interface ProfileAvatarProps {
    imageUrl: string | null;
    className?: string;
}

/** 프로필 이미지가 없으면 기본 사람 아이콘을 보여주는 원형 아바타 */
export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
    return (
        <div
            className={cn(
                "grid h-[88px] w-[88px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#e5e7eb]",
                className,
            )}
        >
            {imageUrl ? (
                <img
                    className="h-full w-full object-cover"
                    src={imageUrl}
                    alt="프로필 이미지"
                />
            ) : (
                <img
                    className="h-11 w-11"
                    src="/icons/movie-icons/person.svg"
                    alt=""
                />
            )}
        </div>
    );
}
