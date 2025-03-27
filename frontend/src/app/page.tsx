import ChatDiv from "./components/ChatDiv";
import { UserProvider } from "./context/UserContext";

export default function Home() {
  return (
    <UserProvider>
      <ChatDiv />
    </UserProvider>
  );
}
