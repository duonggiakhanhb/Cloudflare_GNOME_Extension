const Main = imports.ui.main;
const { St, GLib } = imports.gi;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();


let cloudflare;



const Cloudflare = GObject.registerClass(
class Cloudflare extends PanelMenu.Button {

  _init () {
    let on = Gio.icon_new_for_string(Me.dir.get_path() + "/icons/on.svg");
    let off = Gio.icon_new_for_string(Me.dir.get_path() + "/icons/off.svg");
    super._init(0);
    try{
      var [ok, out, err, exit] = this.warpCommand('warp-cli status');
    }
    catch(e){
      out = '';
    }
    let state = out.includes('Connected') ? true : false;
    let icon = new St.Icon({
      //icon_name : 'security-low-symbolic',
      gicon : state ? on : off,
      style_class : 'cloud-icons',
    });
    this.add_child(icon);
    this.connect('button-press-event', async () => {
      if(state) {
        await this.warpCommand('warp-cli disconnect');
        state = false;
        icon.gicon = off;
      }
      else {
        await this.warpCommand('warp-cli connect');
        state = true;
        icon.gicon = on;
      }
    });
  }
  warpCommand(commandLine){
    try {
      var [ok, out, err, exit] =  GLib.spawn_command_line_async(commandLine);
      return [ok, out, err, exit];
    }
    catch (e){
      this.installedCheck = false;
      logError(e)
    }
  }

});

function init() {
}

function enable() {
  cloudflare = new Cloudflare();
  Main.panel.addToStatusArea('Cloudflare', cloudflare, 1, 'right');
}

function disable() {
  cloudflare.destroy();
  cloudflare = null;
}
