import { HTMLProps } from "react";
import { useSelector } from "react-redux";

import { selectAuthState, selectIsLogged, signIn, signOut } from "@stores/auth";
import { useAppDispatch } from "@stores/store";

interface PageProps extends HTMLProps<HTMLDivElement> {}

const LoginWrap = ({ children, className }: PageProps) => {
  return <section className={className}>{children}</section>;
};

export const Login = ({ className }: PageProps) => {
  const dispatch = useAppDispatch();
  const status = useSelector(selectAuthState);
  const isLogged = useSelector(selectIsLogged);

  const handleSignOut = () => {
    dispatch(signOut());
  };
  if (isLogged && status === "ready") {
    return (
      <LoginWrap className={className}>
        <p>Logged</p>
        <p>
          <button onClick={handleSignOut}>Sign out</button>
        </p>
      </LoginWrap>
    );
  }

  if (status === "undefined" || status === "loading") {
    return <LoginWrap className={className}>Loading...</LoginWrap>;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email) {
      return;
    }
    if (!password) {
      return;
    }
    dispatch(
      signIn({
        email,
        password,
      })
    );
  };
  return (
    <LoginWrap className={className}>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            defaultValue="test@text.com"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            defaultValue="1"
          />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </LoginWrap>
  );
};
