import { ArrowUpIcon, ExitIcon, HomeIcon } from "@radix-ui/react-icons";
import { ColBox } from "./boxes";
import { Form, NavLink } from "@remix-run/react";
import Button from "./button";
import { useOptionalUser } from "~/utilities";
import { Affix, Transition, rem } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <div className=" ">
      <NavigationBar />

      <div className="flex flex-col md:flex-row h-full flex-grow p-2 mt-20 md:mt-12">
        <LeftNavigationBar />
        <main className="flex relative flex-col flex-grsow mt-5 w-full md:w-4/6 mx-auto p-2 md:p-4">
          {children}
        </main>
        <RightNavigationBar />
        <div>
          <Affix position={{ bottom: rem(20), right: rem(20) }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  variant="primary_filled"
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  <ArrowUpIcon />
                  Scroll to top
                </Button>
              )}
            </Transition>
          </Affix>
        </div>
      </div>
    </div>
  );
}

function NavigationBar() {
  const user = useOptionalUser();
  // fix w-4/s6 if I want to change the latout
  return (
    <div className="flex fixed z-10 left-0 right-0 top-0 flex-row justify-around items-baseline w-full md:w-4/s6 mx-auto h-16 p-1 md:p-2">
      <h1 className="text-2xl font-bold">Vanished</h1>
      <NavLink to="/">
        <p className="text-sm font-semibold">Home</p>
      </NavLink>
      <NavLink to="/blog">
        <p className="text-sm font-semibold">Blog</p>
      </NavLink>

      <NavLink to="/about">
        <p className="text-sm font-semibold">About</p>
      </NavLink>
      <NavLink to="/projects">
        <p className="text-sm font-semibold">Projects</p>
      </NavLink>
      <div> </div>
      {/* <Switch size="md" onLabel={<SunIcon />} offLabel={<MoonIcon />} /> */}

      {user ? (
        <Form
          className="flex items-center justify-center p-1"
          method="POST"
          action="/logout"
        >
          <Button variant="danger_filled" size="base">
            <ExitIcon />
          </Button>
        </Form>
      ) : (
        <NavLink to="/login">
          <p className="text-sm font-semibold">Login</p>
        </NavLink>
      )}
    </div>
  );
}

function LeftNavigationBar() {
  return (
    <div className="flex flex-row md:flex-col w-full md:w-1/6 p-2 items-center justify-center md:justify-start md:mt-20 gap-2">
      <NavLink to="/blog/new">
        <p className="text-sm font-semibold">New Post</p>
      </NavLink>
      <NavLink to="/drafts">
        <p className="text-sm font-semibold">Drafts</p>
      </NavLink>
      <NavLink to="/users">
        <p className="text-sm font-semibold">Users</p>
      </NavLink>
      <NavLink to="/chats">
        <p className="text-sm font-semibold">Chat</p>
      </NavLink>
    </div>
  );
}
function RightNavigationBar() {
  return (
    <div className="flex flex-row md:flex-col w-full md:w-1/6 p-2 items-center justify-center md:justify-start md:mt-20 gap-2">
      {" "}
      <ColBox>
        <HomeIcon />
        <HomeIcon />
        <HomeIcon />
      </ColBox>
    </div>
  );
}
