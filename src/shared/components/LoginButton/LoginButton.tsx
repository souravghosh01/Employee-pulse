import clsx from 'clsx';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import Loader from 'shared/components/Loader/Loader';

interface LoginButtonProps {
  image?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  isLoading?: boolean;
}

function LoginButton({
  image,
  children,
  onClick,
  type = 'button',
  className,
  isLoading,
  ...props
}: PropsWithChildren<LoginButtonProps>) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={clsx(
        'btn relative my-1 flex w-full items-center justify-center rounded-lg bg-white py-2 pr-4 pl-2 font-semibold text-zinc-900 shadow hover:bg-zinc-50  active:bg-zinc-50',
        className
      )}
      {...props}
    >
      {image && (
        <Image
          className="mr-6 ml-2 block"
          width="45px"
          height="24px"
          src={image}
          alt={image}
        />
      )}
      {children}
      {isLoading && (
        <Loader
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          isLoading
        />
      )}
    </button>
  );
}

export default LoginButton;
