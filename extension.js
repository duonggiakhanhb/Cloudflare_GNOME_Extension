const Main = imports.ui.main;
const { St, GLib } = imports.gi;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let on = Gio.icon_new_for_string(Me.dir.get_path() + "/on.svg");
let off = Gio.icon_new_for_string(Me.dir.get_path() + "/off.svg");
let myPopup;

const MyPopup = GObject.registerClass(
class MyPopup extends PanelMenu.Button {

  _init () {
  
    super._init(0);
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('warp-cli status');
    let state = out.includes('Connected') ? true : false;

    let icon = new St.Icon({
      //icon_name : 'security-low-symbolic',
      gicon : state ? on : off,
      style_class : 'cloud-icons',
    });

    
    this.add_child(icon);
    log('run');
    this.connect('button-press-event', () => {
      GLib.spawn_command_line_sync('warp-cli disconnect');
      if(state) {
        state = false;
        icon.gicon = off;
      }
      else {
        GLib.spawn_command_line_sync('warp-cli connect');
        state = true;
        icon.gicon = on;
      }
    });
    
  }

});

function init() {
}

function enable() {
  myPopup = new MyPopup();
  Main.panel.addToStatusArea('Cloudflare', myPopup, 1);
}

function disable() {
  myPopup.destroy();
}
