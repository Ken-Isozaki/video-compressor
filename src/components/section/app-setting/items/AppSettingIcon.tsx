import { motion } from "framer-motion";

interface AppSettingMenuProps {
  isAppSettingOpen: boolean;
  setIsAppSettingOpen: (isOpen: boolean) => void;
}

const AppSettingIcon = ({
  isAppSettingOpen,
  setIsAppSettingOpen,
}: AppSettingMenuProps) => {
  return (
    <div className="h-10 w-screen flex items-center justify-end pr-3 z-20">
      <button
        className="cursor-pointer"
        onClick={() => setIsAppSettingOpen(!isAppSettingOpen)}
      >
        <motion.div className="gap-[6px] flex flex-col">
          <motion.div
            className="w-6 h-0.5 bg-slate-600"
            animate={{
              rotate: isAppSettingOpen ? 45 : 0,
              y: isAppSettingOpen ? 8 : 0,
            }}
            transition={{ duration: 0.2 }}
          ></motion.div>
          <motion.div
            className="w-6 h-0.5 bg-slate-600"
            animate={{
              opacity: isAppSettingOpen ? 0 : 1,
            }}
            transition={{ duration: 0.1 }}
          ></motion.div>
          <motion.div
            className="w-6 h-0.5 bg-slate-600"
            animate={{
              rotate: isAppSettingOpen ? -45 : 0,
              y: isAppSettingOpen ? -8 : 0,
            }}
            transition={{ duration: 0.2 }}
          ></motion.div>
        </motion.div>
      </button>
    </div>
  );
};

export default AppSettingIcon;
