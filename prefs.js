/*global imports, print */
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('focuscontrol');
const _ = Gettext.gettext;

let entry, settings;

function init() {
  Convenience.initTranslations('switcher');
}

function buildPrefsWidget() {
    let vWidget = new Gtk.VBox({margin: 10});

    buildWidgets().forEach(w => vWidget.add(w));
    vWidget.show_all();
    return vWidget;
}

function buildWidgets() {
    let settings = Convenience.getSettings();

    let shortcutsWidget = new Gtk.VBox({spacing: 5, homogeneous: true});

    let model = new Gtk.ListStore();
    model.set_column_types([GObject.TYPE_STRING, GObject.TYPE_INT]);

    let actionsTable = new Gtk.TreeView({model: model});

    let [ labels, accels ] = [ "Action", "Key" ].map(
        l => new Gtk.TreeViewColumn({ "title": _(l) })
    );

    [ "left", "down", "up", "right" ].forEach( (direction) => {
        let setting = "focus-" + direction;

        let accelerator = new Gtk.CellRendererAccel({
            'editable': true,
            'accel-mode': Gtk.CellRendererAccelMode.GTK
        });

        let row = model.append();

        let [key, mods] = Gtk.accelerator_parse(settings.get_strv(setting)[0]);

        model.set(row, [0, 1], ["Focus " + direction, mods]);

        accelerator.connect('accel-edited', function(r, iter, key, mods) {
            let value = Gtk.accelerator_name(key, mods);

            let [succ, iterator] = model.get_iter_from_string(iter);

            model.set(iterator, [0, 1], [mods, key]);

            if (key != 0) {
                settings.set_strv(setting, [value]);
            }
        });

        accels.pack_start(accelerator, false);

        accels.add_attribute(accelerator, 'accel-mods', 0);
        accels.add_attribute(accelerator, 'accel-key', 1);

        let label = new Gtk.CellRendererText();

        labels.pack_start(label, true);

        labels.add_attribute(label, "text", 0);
    });

    actionsTable.append_column(labels);
    actionsTable.append_column(accels);

    shortcutsWidget.pack_start(actionsTable, true, true, 0);

    return [ shortcutsWidget ];
}
