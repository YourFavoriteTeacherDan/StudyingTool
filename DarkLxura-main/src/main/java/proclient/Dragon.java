package proclient;


import java.util.concurrent.CopyOnWriteArrayList;

import proclient.clickgui.ClickGui;
import proclient.command.CommandManager;
import proclient.event.Event;
import proclient.event.events.EventChat;
import proclient.module.ModuleManager;
import proclient.settings.SettingsManager;
import proclient.module.Module;
import proclient.ui.ArrayList;
import proclient.ui.DragScreen;
//import proclient.ui.TabGui;
import net.lax1dude.eaglercraft.v1_8.Display;

public class Dragon {
    public static String name = "Dragon", version = "3.0", creator = "Fatal";
    public static Dragon instance = new Dragon();
    public static ArrayList arraylist = new ArrayList();
    public static ModuleManager moduleManager;
    public static CommandManager cmdManager;
    public static ClickGui clickgui;
    public static SettingsManager setmgr;
    public static DragScreen drag;

    

    public static void startClient() {
        setmgr = new SettingsManager();
        moduleManager = new ModuleManager();
        cmdManager = new CommandManager();
        clickgui = new ClickGui();

        Display.setTitle(name + " " + version + "by " + creator);
    }

    public final static ClickGui getClickgui() { return clickgui; }
    public final static DragScreen getDragscreen()  { return drag; }



}
