import { MessageCircleDashed, Timer } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="bg-primary rounded-full hover:shadow-lg py-2 px-4 hover:scale-110 delat-350 ease-in-out transition-all mb-2">
            <Timer className="w-12 h-13 text-white " />
          </div>
          <h3 className="font-semibold text-base sm:text-xl md:text-2xl">Welcome to your personal productivity tool</h3>
          <p className="font-bold text-xl sm:text-2xl md:text-4xl uppercase tracking-wider mt-4 mb-2 text-center">Manage your day efficiently</p>
          <span className="text-center max-w-2xl sm:max-w-3xl md:max-w-4xl">This productivity app will shape the next years of your life. Take control of your time by using our todo list tracking features. Just kidding, you don't need another take todo application to take control of your life, just use notepad. This is just a take home assignment.</span>
          <Link to="/todos">
            <div className="flex items-center gap-2 bg-primary rounded-full hover:shadow-lg py-2 px-4 hover:scale-110 delat-350 ease-in-out transition-all mt-2">
              <MessageCircleDashed className="text-white" />
              <span className="text-white text-sm">View Your Todos</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
