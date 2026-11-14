import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import {
    getMemberRatings,
    type MemberRating,
} from "../../api/members/get-member-ratings";
import { cn } from "../../utils/cn";

const inputClassName =
    "h-11 min-w-0 flex-1 rounded-lg border border-[#dfe3e9] bg-white px-4 text-sm outline-none focus:border-[#536ce6]";
const buttonClassName =
    "h-11 shrink-0 rounded-lg border-0 bg-[#17191f] px-5 text-sm font-bold text-white disabled:opacity-50";
const sectionClassName = "rounded-xl border border-[#dfe3e9] bg-white p-6";

function getErrorMessage(error: unknown) {
    if (isHTTPError(error)) {
        return `요청에 실패했어요. (${error.response.status})`;
    }
    return "서버에 연결하지 못했어요. 백엔드 서버가 켜져 있는지 확인해 주세요.";
}

/** 닉네임 / 이메일 중복 확인처럼 { available } 을 돌려주는 API용 폼 */
function AvailabilityCheck({
    title,
    label,
    placeholder,
    initialValue,
    request,
}: {
    title: string;
    label: string;
    placeholder: string;
    initialValue: string;
    request: (value: string) => Promise<{ available: boolean }>;
}) {
    const [value, setValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedValue = value.trim();
        if (!trimmedValue) return;

        setIsLoading(true);
        setMessage(null);
        setIsAvailable(null);

        request(trimmedValue)
            .then((response) => {
                setIsAvailable(response.available);
                setMessage(
                    response.available
                        ? `사용 가능한 ${label}이에요.`
                        : `이미 사용 중인 ${label}이에요.`,
                );
            })
            .catch((error: unknown) => setMessage(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    return (
        <section className={sectionClassName}>
            <h2 className="text-lg font-extrabold text-[#17191f]">{title}</h2>

            <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
                <input
                    className={inputClassName}
                    aria-label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
                <button className={buttonClassName} type="submit" disabled={isLoading}>
                    {isLoading ? "확인 중..." : "중복 확인"}
                </button>
            </form>

            {message && (
                <p
                    className={cn(
                        "mt-3 text-sm",
                        isAvailable === null && "text-[#d14343]",
                        isAvailable === true && "font-semibold text-[#2f9e6b]",
                        isAvailable === false && "font-semibold text-[#d14343]",
                    )}
                >
                    {message}
                </p>
            )}
        </section>
    );
}

function MemberRatings() {
    const [memberId, setMemberId] = useState("1");
    const [ratings, setRatings] = useState<MemberRating[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const parsedMemberId = Number(memberId);

        if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) {
            setRatings(null);
            setErrorMessage("올바른 회원 번호를 입력해 주세요.");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        getMemberRatings(parsedMemberId)
            .then((response) => setRatings(response))
            .catch((error: unknown) => {
                setRatings(null);
                setErrorMessage(
                    isHTTPError(error) && error.response.status === 404
                        ? "존재하지 않는 회원이에요."
                        : getErrorMessage(error),
                );
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <section className={sectionClassName}>
            <h2 className="text-lg font-extrabold text-[#17191f]">내 평점 목록</h2>

            <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
                <input
                    className={inputClassName}
                    aria-label="회원 번호"
                    inputMode="numeric"
                    placeholder="회원 번호"
                    value={memberId}
                    onChange={(event) => setMemberId(event.target.value)}
                />
                <button className={buttonClassName} type="submit" disabled={isLoading}>
                    {isLoading ? "불러오는 중..." : "평점 조회"}
                </button>
            </form>

            {errorMessage && (
                <p className="mt-3 text-sm text-[#d14343]">{errorMessage}</p>
            )}

            {ratings && ratings.length === 0 && (
                <p className="mt-3 text-sm text-[#727887]">아직 남긴 평점이 없어요.</p>
            )}

            {ratings && ratings.length > 0 && (
                <ul className="mt-4 divide-y divide-[#eef0f3]">
                    {ratings.map((rating) => (
                        <li className="py-3" key={rating.ratingId}>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-[#17191f]">
                                    영화 ID {rating.movieId}
                                </span>
                                <span className="text-sm font-bold text-[#536ce6]">
                                    {"★".repeat(rating.score)}
                                    <span className="text-[#dfe3e9]">
                                        {"★".repeat(5 - rating.score)}
                                    </span>
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-[#535869]">
                                {rating.comment || "코멘트 없음"}
                            </p>
                            <p className="mt-1 text-xs text-[#9ca2ad]">
                                {rating.createdAt.slice(0, 10).replaceAll("-", ".")}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export function MyPage() {
    return (
        <main className="mx-auto w-[calc(100%-48px)] max-w-[720px] flex-1 py-[31px] pb-[110px]">
            <h1 className="mb-7 text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#17191f]">
                내 정보
            </h1>

            <div className="grid gap-5">
                <AvailabilityCheck
                    title="닉네임 중복 확인"
                    label="닉네임"
                    placeholder="닉네임을 입력해 주세요"
                    initialValue="수현"
                    request={checkNickname}
                />

                <AvailabilityCheck
                    title="이메일 중복 확인"
                    label="이메일"
                    placeholder="이메일을 입력해 주세요"
                    initialValue="noco@umc.com"
                    request={checkEmail}
                />

                <MemberRatings />
            </div>
        </main>
    );
}
