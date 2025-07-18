"use client";
import ButtonSignOut from "@/components/button-sign-out";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import Logo from "/public/logo.svg";

const NavigationBarAuthenticated = () => {
  const { session } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Jika menu mobile terbuka
      if (isMobileMenuOpen) {
        const target = event.target as Node;

        // Jika klik dilakukan bukan di dalam container menu & bukan pada tombol toggle
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(target) &&
          toggleButtonRef.current &&
          !toggleButtonRef.current.contains(target)
        ) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  if (!session) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed z-50 w-full px-4 sm:px-6 lg:px-40 py-4 sm:py-6 transition-all ease-out duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-white-500 shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex gap-2 items-center">
              <div className="w-10 sm:w-12">
                <Image src={Logo} alt="Logo" priority />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`font-satoshi p-3 ${
                pathname === "/"
                  ? "text-body-1-bold text-blue-500 dashedBorder"
                  : "text-body-1-medium text-black-500 hover:text-blue-500"
              }`}
            >
              Generate Roadmap
            </Link>
            <Link
              href="/community"
              className={`font-satoshi p-3 ${
                pathname === "/community"
                  ? "text-body-1-bold text-blue-500 dashedBorder"
                  : "text-body-1-medium text-black-500 hover:text-blue-500"
              }`}
            >
              Community Roadmap
            </Link>
          </div>

          <button
            ref={toggleButtonRef}
            className="flex items-center justify-center lg:hidden w-11 h-11 text-gray-500 border-2 border-blue-100 bg-white-500 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                width="24"
                height="31"
                viewBox="0 0 24 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all ease-[cubic-bezier(0.19,1,0.22,1)] duration-200"
              >
                <path
                  d="M22.4247 26.0815C22.4247 27.0155 21.8912 27.8696 21.0479 28.2713C19.4559 29.0297 16.4222 30.0517 11.6349 30.0517C6.84765 30.0517 3.81404 29.0297 2.22198 28.2713C1.3787 27.8696 0.845215 27.0155 0.845215 26.0815C0.845215 24.7396 1.933 23.6519 3.27484 23.6519H19.9951C21.3369 23.6519 22.4247 24.7396 22.4247 26.0815Z"
                  fill="#E59328"
                />
                <path
                  d="M22.4247 22.6011C22.4247 21.667 21.8912 20.8129 21.0479 20.4113C19.4559 19.6529 16.4222 18.6309 11.6349 18.6309C6.84765 18.6309 3.81404 19.6529 2.22198 20.4113C1.3787 20.8129 0.845215 21.667 0.845215 22.6011C0.845215 22.6146 0.846012 22.6279 0.846246 22.6413C0.846012 22.6547 0.845215 22.6681 0.845215 22.6815C0.845215 23.6155 1.3787 24.4697 2.22198 24.8713C3.81404 25.6297 6.84765 26.6517 11.6349 26.6517C16.4222 26.6517 19.4559 25.6297 21.0479 24.8713C21.8912 24.4697 22.4247 23.6155 22.4247 22.6815C22.4247 22.668 22.4239 22.6547 22.4237 22.6413C22.4239 22.6278 22.4247 22.6145 22.4247 22.6011Z"
                  fill="#7A2F18"
                />
                <path
                  d="M11.635 21.6308C17.1082 21.6308 21.5451 20.1194 21.5451 18.2551C21.5451 16.3907 17.1082 14.8794 11.635 14.8794C6.16177 14.8794 1.72485 16.3907 1.72485 18.2551C1.72485 20.1194 6.16177 21.6308 11.635 21.6308Z"
                  fill="#DB1D1D"
                />
                <path
                  d="M11.635 20.3461C17.1082 20.3461 21.5451 18.8348 21.5451 16.9704C21.5451 15.1061 17.1082 13.5947 11.635 13.5947C6.16177 13.5947 1.72485 15.1061 1.72485 16.9704C1.72485 18.8348 6.16177 20.3461 11.635 20.3461Z"
                  fill="#FF473E"
                />
                <path
                  d="M22.3325 13.334C21.1998 12.7053 19.5443 12.4578 18.0889 12.4585C17.295 12.4589 16.4868 12.5417 15.7291 12.6966C15.1389 12.8173 14.5621 12.97 13.9551 13.0485C13.8533 13.0527 13.7515 13.0537 13.6497 13.0514C13.5799 13.0406 13.5104 13.0278 13.4413 13.013C13.1897 12.9285 12.9507 12.8295 12.7068 12.735C12.316 12.5835 11.9067 12.4651 11.4857 12.3534C10.7452 12.157 9.96516 12.0633 9.17138 12.0165C7.67241 11.928 6.12709 12.154 4.79434 12.6079C4.58092 12.6255 4.37038 12.6686 4.1672 12.7362C2.80674 13.1899 1.65455 13.9141 0.845352 14.7598C0.673508 14.9395 0.521352 15.1273 0.390758 15.3213C0.106086 15.7443 -0.149289 16.1793 0.103227 16.647C0.576008 17.5228 1.98896 17.8423 3.28876 17.6368C4.18529 17.495 4.88438 17.1067 5.58746 16.7393C5.76371 16.6557 5.94615 16.5795 6.13857 16.5142C6.15995 16.5096 6.18127 17.3024 6.20279 17.2983C6.38307 17.4065 6.55285 17.5221 6.73712 17.6276C7.05099 17.8075 7.3868 17.9808 7.7439 18.1228C8.47519 18.4138 9.34984 18.6001 10.2103 18.5949C11.0895 18.5895 11.9291 18.4052 12.6228 18.0534C12.9924 17.866 13.2955 17.6448 13.5297 17.3756C13.6155 17.2771 13.6895 17.175 13.7706 17.0756C13.8369 17.087 14.3388 16.4558 14.5138 16.539C14.952 16.7696 15.3797 17.0119 15.8546 17.2086C16.5112 17.4805 17.2839 17.6438 18.0633 17.6451C19.5639 17.6478 20.9796 17.0793 22.0214 16.4094C22.559 16.0637 23.0618 15.6048 23.2096 15.1108C23.4055 14.4564 23.1263 13.7747 22.3325 13.334ZM6.96619 14.3587C7.27963 14.2914 7.59621 14.2397 7.91476 14.2038C8.35422 14.1763 8.79497 14.1763 9.23443 14.2038C9.64702 14.2504 10.0503 14.3215 10.4424 14.4179C10.7534 14.5162 11.0455 15.4316 11.3431 15.5448C11.0416 15.7783 10.8717 16.0569 10.6234 16.3144C10.6108 16.323 10.5978 16.3313 10.5848 16.3396C10.5526 16.3524 10.5201 16.3647 10.4874 16.3764C10.4264 16.3888 10.365 16.3997 10.3035 16.409C10.2246 16.4112 10.1456 16.4111 10.0667 16.4088C9.949 16.3913 9.83199 16.3694 9.71593 16.3432C9.52942 16.2816 9.34648 16.2096 9.16796 16.1277C8.84073 15.9443 8.54471 15.7391 8.20304 15.5658C7.83404 15.3788 7.41512 14.4339 6.96619 14.3587ZM19.2771 15.0943C19.0385 15.2067 18.7899 15.3079 18.5268 15.3932C18.41 15.4197 18.2922 15.4417 18.1738 15.4593C18.1127 15.4608 18.0516 15.4609 17.9905 15.4596C17.9299 15.45 17.8696 15.439 17.8095 15.4264C17.6004 15.3552 17.4038 15.2706 17.2132 15.1791C16.9884 15.06 16.7661 14.9369 16.5382 14.8194C16.8496 14.7558 17.1635 14.7 17.486 14.6616C17.8963 14.6365 18.3077 14.6368 18.718 14.6624C19.0541 14.701 19.3879 14.7578 19.7178 14.8326C19.5787 14.9251 19.4305 15.0116 19.2771 15.0943Z"
                  fill="#00B89C"
                />
                <path
                  d="M4.77683 16.6761C4.14772 15.6584 2.93839 13.7825 1.42747 11.8297C-0.743498 12.1981 16.5586 9.28174 16.5586 9.28174C21.3903 9.79066 22.0285 12.1811 22.031 13.3998C22.0318 13.7899 21.6972 14.0968 21.308 14.0693C10.9571 13.3364 7.08158 15.647 5.80508 16.821C5.49406 17.1069 4.99902 17.0355 4.77683 16.6761Z"
                  fill="#FECB21"
                />
                <path
                  d="M11.6349 0C5.86018 0 0.845215 3.64725 0.845215 8.04047C0.845215 10.3829 5.67592 12.2817 11.6349 12.2817C17.594 12.2817 22.4247 10.3829 22.4247 8.04047C22.4247 3.77152 17.4097 0 11.6349 0Z"
                  fill="#E59328"
                />
                <path
                  d="M4.86851 5.04928L5.32137 6.03051C5.34703 6.08613 5.34955 6.14966 5.32837 6.20713C5.3072 6.26461 5.26406 6.31131 5.20844 6.33698C5.1761 6.35174 5.14081 6.35891 5.10527 6.35792C5.06973 6.35694 5.03489 6.34784 5.00341 6.33131L4.04876 5.82492C3.75823 5.67079 3.6476 5.31033 3.80173 5.01979C3.95585 4.72926 4.31632 4.61864 4.60685 4.77276C4.72207 4.8337 4.81402 4.93087 4.86851 5.04928ZM14.4146 1.57687C14.1241 1.42275 13.7636 1.53337 13.6095 1.8239C13.4554 2.11443 13.566 2.4749 13.8566 2.62903L14.8112 3.13542C14.8427 3.15195 14.8775 3.16105 14.9131 3.16203C14.9486 3.16302 14.9839 3.15585 15.0162 3.14109C15.0719 3.11542 15.115 3.06872 15.1362 3.01124C15.1573 2.95377 15.1548 2.89024 15.1292 2.83462L14.6763 1.85339C14.6218 1.735 14.5298 1.63784 14.4146 1.57687ZM9.04277 2.78357C8.85415 2.51414 8.4828 2.44865 8.21337 2.63732C7.94393 2.826 7.87844 3.19729 8.06712 3.46673L8.68694 4.35197C8.70746 4.381 8.73435 4.40495 8.76555 4.42199C8.79674 4.43902 8.83143 4.4487 8.86694 4.45026C8.92814 4.45267 8.9878 4.43069 9.0328 4.38914C9.0778 4.3476 9.10447 4.28988 9.10694 4.22868L9.15002 3.14887C9.15533 3.01864 9.11764 2.89027 9.04277 2.78357ZM19.9886 5.41622C20.1311 5.10529 19.9946 4.73775 19.6837 4.59529C19.3728 4.45279 19.0053 4.58934 18.8628 4.90022L18.5134 5.66259C18.4942 5.70459 18.4875 5.75124 18.4941 5.79695C18.5007 5.84266 18.5203 5.8855 18.5507 5.92034C18.581 5.95517 18.6207 5.98051 18.6651 5.99334C18.7095 6.00616 18.7566 6.00592 18.8008 5.99264L19.604 5.75123C19.7673 5.70131 19.9119 5.5837 19.9886 5.41622ZM11.1547 7.9312C10.8314 7.87087 10.5204 8.08401 10.46 8.40731C10.3997 8.73061 10.6129 9.04162 10.9361 9.102L11.9985 9.30028C12.0334 9.30665 12.0694 9.30494 12.1036 9.29527C12.1378 9.2856 12.1694 9.26823 12.1958 9.2445C12.2183 9.22415 12.2366 9.19957 12.2496 9.17216C12.2626 9.14476 12.27 9.11506 12.2715 9.08476C12.273 9.05447 12.2686 9.02418 12.2584 8.99562C12.2482 8.96705 12.2324 8.94078 12.2121 8.91829L11.487 8.11701C11.3996 8.02027 11.2829 7.95497 11.1547 7.9312ZM16.8805 8.83373C17.0122 9.13514 17.3632 9.27272 17.6646 9.14104C17.966 9.00937 18.1036 8.65833 17.9719 8.35692L17.5393 7.36664C17.5249 7.33412 17.5033 7.30532 17.4761 7.28245C17.4489 7.25958 17.4168 7.24324 17.3823 7.23468C17.3528 7.22751 17.3222 7.22621 17.2922 7.23086C17.2622 7.2355 17.2335 7.24601 17.2076 7.26178C17.1817 7.27754 17.1591 7.29826 17.1412 7.32274C17.1233 7.34722 17.1104 7.37499 17.1032 7.40447L16.8476 8.45447C16.8167 8.58108 16.8282 8.71434 16.8805 8.83373ZM7.9354 8.53781C7.97318 8.20734 7.7359 7.90884 7.40543 7.87106C7.07496 7.83328 6.77646 8.07056 6.73868 8.40103L6.6146 9.48684C6.61152 9.51456 6.61439 9.54262 6.62302 9.56915C6.63166 9.59567 6.64585 9.62004 6.66466 9.64064C6.69959 9.67865 6.74818 9.70123 6.79975 9.70342C6.85133 9.70561 6.90166 9.68722 6.93968 9.65231L7.74447 8.91295C7.85119 8.81496 7.91898 8.68176 7.9354 8.53781ZM13.3934 6.57581C13.7021 6.6892 14.0443 6.53086 14.1577 6.22214C14.2711 5.91342 14.1128 5.57123 13.8041 5.45784L12.7896 5.08528C12.7562 5.07316 12.7205 5.06886 12.6851 5.07269C12.6498 5.07653 12.6158 5.0884 12.5857 5.1074C12.5341 5.14036 12.4977 5.19248 12.4845 5.25229C12.4713 5.3121 12.4824 5.37471 12.5153 5.42634L13.0968 6.33726C13.1668 6.4472 13.271 6.53103 13.3934 6.57581Z"
                  fill="#FFCD7D"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all ease-[cubic-bezier(0.19,1,0.22,1)] duration-75"
              >
                <path
                  d="M22.7294 18.6425C22.7294 19.5765 22.1959 20.4307 21.3526 20.8323C19.7605 21.5907 16.7269 22.6127 11.9396 22.6127C7.15234 22.6127 4.11873 21.5907 2.52667 20.8323C1.68339 20.4307 1.1499 19.5765 1.1499 18.6425C1.1499 17.3007 2.23768 16.2129 3.57953 16.2129H20.2997C21.6416 16.2129 22.7294 17.3007 22.7294 18.6425Z"
                  fill="#E59328"
                />
                <path
                  d="M22.6356 14.9414C22.6356 14.0074 22.1021 13.1533 21.2589 12.7516C19.6668 11.9932 16.6332 10.9712 11.8459 10.9712C7.05859 10.9712 4.02498 11.9932 2.43292 12.7516C1.58964 13.1533 1.05615 14.0074 1.05615 14.9414C1.05615 14.9549 1.05695 14.9682 1.05718 14.9816C1.05695 14.9951 1.05615 15.0084 1.05615 15.0218C1.05615 15.9559 1.58964 16.81 2.43292 17.2117C4.02498 17.9701 7.05859 18.9921 11.8459 18.9921C16.6332 18.9921 19.6668 17.9701 21.2589 17.2117C22.1021 16.81 22.6356 15.9559 22.6356 15.0218C22.6356 15.0083 22.6348 14.995 22.6346 14.9816C22.6348 14.9682 22.6356 14.9549 22.6356 14.9414Z"
                  fill="#7A2F18"
                />
                <path
                  d="M12.0861 17.329C17.5594 17.329 21.9963 15.8177 21.9963 13.9533C21.9963 12.089 17.5594 10.5776 12.0861 10.5776C6.61294 10.5776 2.17603 12.089 2.17603 13.9533C2.17603 15.8177 6.61294 17.329 12.0861 17.329Z"
                  fill="#DB1D1D"
                />
                <path
                  d="M12.0861 16.0444C17.5594 16.0444 21.9963 14.533 21.9963 12.6687C21.9963 10.8043 17.5594 9.29297 12.0861 9.29297C6.61294 9.29297 2.17603 10.8043 2.17603 12.6687C2.17603 14.533 6.61294 16.0444 12.0861 16.0444Z"
                  fill="#FF473E"
                />
                <path
                  d="M22.8283 10.542C21.6955 9.91326 20.04 9.66585 18.5846 9.66651C17.7907 9.66689 16.9825 9.74971 16.2248 9.90464C15.6346 10.0253 15.0578 10.178 14.4508 10.2565C14.3491 10.2607 14.2472 10.2617 14.1454 10.2594C14.0756 10.2486 14.0061 10.2358 13.937 10.221C13.6854 10.1365 13.4465 10.0375 13.2026 9.94298C12.8117 9.79153 12.4025 9.67312 11.9815 9.56142C11.2409 9.36496 10.4609 9.27131 9.66711 9.22448C8.16814 9.13603 6.62281 9.36196 5.29006 9.8159C5.07665 9.83351 4.86611 9.87659 4.66292 9.9442C3.30247 10.3979 2.15028 11.1221 1.34108 11.9678C1.16924 12.1475 1.01708 12.3353 0.886486 12.5293C0.601814 12.9523 0.346439 13.3873 0.598954 13.855C1.07174 14.7308 2.48469 15.0503 3.78449 14.8448C4.68102 14.703 5.38011 14.3147 6.08319 13.9473C6.25944 13.8637 6.44188 13.7875 6.6343 13.7222C6.65567 13.7176 6.677 14.5104 6.69852 14.5063C6.8788 14.6145 7.04858 14.7301 7.23284 14.8357C7.54672 15.0155 7.88253 15.1888 8.23963 15.3308C8.97092 15.6218 9.84556 15.8081 10.706 15.8029C11.5852 15.7975 12.4248 15.6132 13.1185 15.2614C13.4881 15.074 13.7912 14.8529 14.0255 14.5836C14.1112 14.4851 14.1853 14.383 14.2663 14.2836C14.3327 14.295 14.8345 13.6638 15.0095 13.747C15.4477 13.9776 15.8755 14.2199 16.3503 14.4166C17.0069 14.6885 17.7797 14.8518 18.559 14.8531C20.0596 14.8559 21.4753 14.2873 22.5171 13.6174C23.0548 13.2717 23.5575 12.8128 23.7054 12.3188C23.9012 11.6644 23.622 10.9827 22.8283 10.542ZM7.46192 11.5667C7.77536 11.4994 8.09193 11.4477 8.41049 11.4118C8.84994 11.3843 9.2907 11.3843 9.73016 11.4118C10.1428 11.4584 10.5461 11.5296 10.9381 11.6259C11.2491 11.7242 11.5413 12.6396 11.8389 12.7528C11.5374 12.9863 11.3675 13.2649 11.1192 13.5224C11.1065 13.531 11.0935 13.5393 11.0805 13.5476C11.0483 13.5604 11.0158 13.5727 10.9832 13.5844C10.9221 13.5968 10.8608 13.6077 10.7992 13.617C10.7203 13.6192 10.6413 13.6191 10.5624 13.6168C10.4447 13.5993 10.3277 13.5774 10.2117 13.5512C10.0251 13.4896 9.84221 13.4176 9.66369 13.3357C9.33645 13.1523 9.04044 12.9472 8.69877 12.7739C8.32977 12.5868 7.91084 11.6419 7.46192 11.5667ZM19.7728 12.3023C19.5342 12.4147 19.2856 12.5159 19.0225 12.6012C18.9057 12.6277 18.788 12.6497 18.6695 12.6673C18.6084 12.6688 18.5473 12.6689 18.4863 12.6676C18.4257 12.6581 18.3653 12.647 18.3052 12.6344C18.0962 12.5632 17.8995 12.4786 17.7089 12.3871C17.4841 12.268 17.2618 12.1449 17.0339 12.0274C17.3454 11.9638 17.6593 11.908 17.9817 11.8696C18.392 11.8445 18.8035 11.8448 19.2137 11.8704C19.5498 11.909 19.8836 11.9658 20.2136 12.0406C20.0744 12.1331 19.9262 12.2196 19.7728 12.3023Z"
                  fill="#00B89C"
                />
                <path
                  d="M5.39292 15.5638C4.76381 14.5461 3.55448 12.6702 2.04356 10.7174C-0.127409 11.0858 17.1747 8.16943 17.1747 8.16943C22.0064 8.67836 22.6446 11.0688 22.647 12.2875C22.6478 12.6776 22.3132 12.9845 21.9241 12.957C11.5732 12.2241 7.69767 14.5347 6.42117 15.7087C6.11015 15.9946 5.61511 15.9232 5.39292 15.5638Z"
                  fill="#FECB21"
                />
                <path
                  d="M11.8459 1.19971C6.07112 1.19971 1.05615 4.84696 1.05615 9.24018C1.05615 11.5826 5.88686 13.4814 11.8459 13.4814C17.8049 13.4814 22.6356 11.5826 22.6356 9.24018C22.6356 4.97122 17.6207 1.19971 11.8459 1.19971Z"
                  fill="#E59328"
                />
                <path
                  d="M5.07944 6.24899L5.5323 7.23022C5.55797 7.28583 5.56049 7.34937 5.53931 7.40684C5.51814 7.46431 5.475 7.51102 5.41938 7.53669C5.38704 7.55145 5.35175 7.55861 5.31621 7.55763C5.28067 7.55665 5.24583 7.54754 5.21435 7.53102L4.25969 7.02463C3.96916 6.8705 3.85854 6.51003 4.01266 6.2195C4.16679 5.92897 4.52726 5.81834 4.81779 5.97247C4.93301 6.03341 5.02496 6.13058 5.07944 6.24899ZM14.6256 2.77658C14.3351 2.62245 13.9746 2.73308 13.8205 3.02361C13.6663 3.31414 13.777 3.67461 14.0675 3.82874L15.0221 4.33513C15.0536 4.35165 15.0885 4.36076 15.124 4.36174C15.1595 4.36272 15.1948 4.35556 15.2272 4.3408C15.2828 4.31513 15.3259 4.26842 15.3471 4.21095C15.3683 4.15348 15.3658 4.08994 15.3401 4.03433L14.8872 3.05309C14.8327 2.93471 14.7408 2.83754 14.6256 2.77658ZM9.25371 3.98328C9.06508 3.71384 8.69374 3.64836 8.4243 3.83703C8.15487 4.0257 8.08938 4.397 8.27805 4.66644L8.89788 5.55167C8.9184 5.5807 8.94528 5.60466 8.97648 5.62169C9.00768 5.63873 9.04237 5.6484 9.07788 5.64997C9.13908 5.65238 9.19874 5.6304 9.24374 5.58885C9.28874 5.5473 9.31541 5.48959 9.31788 5.42839L9.36096 4.34858C9.36626 4.21834 9.32858 4.08998 9.25371 3.98328ZM20.1996 6.61592C20.3421 6.305 20.2055 5.93745 19.8947 5.795C19.5837 5.6525 19.2162 5.78905 19.0737 6.09992L18.7243 6.8623C18.7051 6.90429 18.6984 6.95094 18.705 6.99666C18.7116 7.04237 18.7313 7.08521 18.7616 7.12004C18.7919 7.15487 18.8317 7.18022 18.876 7.19304C18.9204 7.20587 18.9675 7.20562 19.0118 7.19234L19.8149 6.95094C19.9783 6.90102 20.1228 6.78341 20.1996 6.61592ZM11.3657 9.13091C11.0424 9.07058 10.7314 9.28372 10.671 9.60702C10.6106 9.93031 10.8238 10.2413 11.1471 10.3017L12.2094 10.5C12.2444 10.5064 12.2803 10.5046 12.3146 10.495C12.3488 10.4853 12.3803 10.4679 12.4068 10.4442C12.4292 10.4239 12.4475 10.3993 12.4605 10.3719C12.4735 10.3445 12.481 10.3148 12.4825 10.2845C12.484 10.2542 12.4795 10.2239 12.4693 10.1953C12.4591 10.1668 12.4434 10.1405 12.423 10.118L11.6979 9.31672C11.6106 9.21998 11.4938 9.15468 11.3657 9.13091ZM17.0914 10.0334C17.2231 10.3348 17.5742 10.4724 17.8756 10.3408C18.177 10.2091 18.3146 9.85803 18.1829 9.55663L17.7502 8.56634C17.7359 8.53383 17.7142 8.50503 17.687 8.48216C17.6598 8.45928 17.6277 8.44295 17.5932 8.43439C17.5637 8.42721 17.5331 8.42591 17.5032 8.43056C17.4732 8.43521 17.4444 8.44572 17.4185 8.46148C17.3926 8.47725 17.37 8.49797 17.3521 8.52245C17.3342 8.54693 17.3213 8.5747 17.3141 8.60417L17.0585 9.65417C17.0276 9.78079 17.0392 9.91405 17.0914 10.0334ZM8.14633 9.73752C8.18412 9.40705 7.94683 9.10855 7.61637 9.07077C7.2859 9.03299 6.9874 9.27027 6.94962 9.60074L6.82554 10.6865C6.82245 10.7143 6.82533 10.7423 6.83396 10.7689C6.84259 10.7954 6.85679 10.8197 6.8756 10.8403C6.91053 10.8784 6.95912 10.9009 7.01069 10.9031C7.06226 10.9053 7.1126 10.8869 7.15062 10.852L7.95541 10.1127C8.06213 10.0147 8.12992 9.88147 8.14633 9.73752ZM13.6044 7.77552C13.9131 7.88891 14.2553 7.73056 14.3687 7.42184C14.4821 7.11313 14.3237 6.77094 14.015 6.65755L13.0006 6.28499C12.9671 6.27287 12.9314 6.26857 12.896 6.2724C12.8607 6.27624 12.8267 6.28811 12.7967 6.30711C12.745 6.34007 12.7086 6.39219 12.6954 6.452C12.6822 6.51181 12.6933 6.57442 12.7263 6.62605L13.3077 7.53697C13.3777 7.64691 13.482 7.73074 13.6044 7.77552Z"
                  fill="#FFCD7D"
                />
              </svg>
            )}
          </button>

          {/* Desktop Dropdown Menu */}
          <div className="hidden lg:block">
            <DropdownMenu.Root
              open={isDesktopMenuOpen}
              onOpenChange={setIsDesktopMenuOpen}
            >
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center justify-center focus:outline-none">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={session.user.avatar}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full bg-gray-300 items-center justify-center w-8 h-8 sm:w-10 sm:h-10"
                    />
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M1.84314 5.63633C1.7954 5.59122 1.73925 5.55595 1.67788 5.53255C1.61652 5.50914 1.55114 5.49805 1.48549 5.4999C1.41984 5.50176 1.3552 5.51653 1.29526 5.54337C1.23531 5.57021 1.18125 5.60859 1.13614 5.65633C1.09103 5.70406 1.05576 5.76022 1.03235 5.82158C1.00895 5.88295 0.997854 5.94832 0.999712 6.01397C1.00157 6.07962 1.01634 6.14426 1.04318 6.20421C1.07002 6.26415 1.1084 6.31822 1.15614 6.36333L5.65614 10.6133C5.74897 10.7011 5.87188 10.75 5.99964 10.75C6.12739 10.75 6.2503 10.7011 6.34314 10.6133L10.8436 6.36333C10.8924 6.31852 10.9318 6.26446 10.9595 6.2043C10.9872 6.14413 11.0027 6.07906 11.0051 6.01287C11.0074 5.94667 10.9966 5.88066 10.9732 5.81869C10.9498 5.75671 10.9144 5.69999 10.8689 5.65183C10.8234 5.60367 10.7688 5.56503 10.7083 5.53814C10.6478 5.51126 10.5825 5.49667 10.5163 5.49523C10.45 5.49379 10.3842 5.50552 10.3225 5.52974C10.2609 5.55396 10.2047 5.59019 10.1571 5.63633L5.99964 9.56233L1.84314 5.63633Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-white-500 border-2 border-gray-100 rounded-lg shadow-lg z-50"
                  sideOffset={5}
                  align="end"
                >
                  <div className="flex flex-col">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Image
                          src={session.user.avatar}
                          alt="User Avatar"
                          width={50}
                          height={50}
                          className="rounded-full bg-gray-300 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-semibold text-black-500 truncate"
                            title={session.user.name}
                          >
                            {session.user.name}
                          </p>
                          <p
                            className="text-sm text-gray-500 truncate"
                            title={session.user.email || "User"}
                          >
                            {session.user.email || "User"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu.Item className="focus:outline-none">
                      <Link
                        href="/profile"
                        className="flex items-center px-3 py-2 text-body-1-medium text-gray-700 hover:bg-blue-50 hover:text-blue-500 w-full"
                      >
                        My Profile
                      </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="border border-gray-200" />

                    <DropdownMenu.Item className="focus:outline-none">
                      <div className="px-3 text-red-500 bg-red-50 hover:bg-red-100 w-full rounded-b-lg">
                        <ButtonSignOut className="py-2 text-body-1-medium" />
                      </div>
                    </DropdownMenu.Item>
                  </div>

                  <DropdownMenu.Arrow className="fill-white-500" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white-500 rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="flex flex-col">
              <Link href="/profile">
                <div
                  className={cn(
                    pathname === "/profile" && "bg-blue-50",
                    "p-4 border-b"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={session.user.avatar}
                      alt="User Avatar"
                      width={50}
                      height={50}
                      className="rounded-full bg-gray-300 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          pathname === "/profile"
                            ? "text-blue-500"
                            : "text-black-500",
                          "font-semibold truncate"
                        )}
                        title={session.user.name}
                      >
                        {session.user.name}
                      </p>
                      <div className="flex flex-row gap-1 items-center">
                        <p
                          className={cn(
                            pathname === "/profile"
                              ? "text-blue-500"
                              : "text-gray-500",
                            "text-sm"
                          )}
                        >
                          My Profile
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            pathname === "/profile"
                              ? "stroke-blue-500"
                              : "stroke-gray-500",
                            "size-4 flex-shrink-0"
                          )}
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 6l6 6l-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href="/"
                className={`px-4 py-3 ${
                  pathname === "/"
                    ? "text-blue-500 text-body-1-bold bg-blue-50"
                    : "text-body-1-medium"
                }`}
              >
                Generate Roadmap
              </Link>
              <Link
                href="/community"
                className={`px-4 py-3 ${
                  pathname === "/community"
                    ? "text-blue-500 text-body-1-bold bg-blue-50"
                    : "text-body-1-medium"
                }`}
              >
                Community Roadmap
              </Link>
              <div className="w-full border border-gray-200" />
              <div className="text-start px-4 text-red-500 text-body-1-regular">
                <ButtonSignOut className="py-3 text-body-1-medium" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBarAuthenticated;
