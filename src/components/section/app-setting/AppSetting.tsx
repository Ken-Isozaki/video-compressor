import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppSettingIcon from "./items/AppSettingIcon";
import OutputSetting from "./items/OutputSetting";

const AppSetting = () => {
  const [isAppSettingOpen, setIsAppSettingOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーメニュー */}
      <AppSettingIcon
        isAppSettingOpen={isAppSettingOpen}
        setIsAppSettingOpen={setIsAppSettingOpen}
      />

      {/* 表示する設定 */}
      <AnimatePresence>
        {isAppSettingOpen && (
          <motion.div
            key="app-setting-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 z-10 bg-slate-200 text-black w-screen h-screen overflow-hidden"
          >
            <OutputSetting />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSetting;
