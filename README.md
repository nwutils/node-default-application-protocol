# node-default-application-protocol

A cross-platform, Node tool for setting, checking, and removing a custom URI protocol handler on an OS.

**Example:** `myapp://settings` could be tied to open a specific executable and pass in the argument `settings` (available to `process.argv[]`).

* * *

## Current status

* [x] Potential solution found
* [x] API designed (subject to change)
* [ ] Windows Working
* [ ] Linux Working
* [ ] OSX Working
* [ ] Published to `npm`

* * *

## API Design (WIP)

This is just a simple draft which may change as development advances on each OS.

```js
const protocolHandler = require('node-default-application-protocol');

// returns boolean where true = success
const protocolSet = protocolHandler.setAsDefault({
  protocol: 'myapp',
  executable: process.execPath
});

if (protocolSet) {
  console.log('Everything worked');
} else {
  console.log('There was a problem setting the protocol');
}
```

```js
const protocolHandler = require('node-default-application-protocol');

// returns boolean where true = success
const isProtocol = protocolHandler.isDefault({
  protocol: 'myapp',
  executable: process.execPath
});

if (isProtocol) {
  console.log('Yes, that protocol already exists');
} else {
  console.log('No it has not been set');
}
```

```js
const protocolHandler = require('node-default-application-protocol');

// returns boolean where true = success
const removedProtocol = protocolHandler.removeDefault({
  protocol: 'myapp',
  executable: process.execPath
});

if (removedProtocol) {
  console.log('Removed successfully');
} else {
  console.log('There was a problem removing the protocol');
}
```

```js
const protocolHandler = require('node-default-application-protocol');

// returns boolean where true = success
const defaultApplication = protocolHandler.checkDefault({
  protocol: 'myapp'
});

if (defaultApplication) {
  console.log('The default application is', defaultApplication);
} else {
  console.log('No default application is applied to this protocol');
}
```

### Global

**Key**         | **Type** | **Allowed**              | **Default**                  | **Description**
:--             | :--      | :--                      | :--                          | :--
`verbose`       | Boolean  | `true`, `false`          | `true`                       | If true, consoles out helpful warnings and errors.
`customLogger`  | Function | Any function             | None                         | You can pass in your own custom function to log errors/warnings to. When called the function will receive a message string for the first argument and sometimes an error object for the second argument. This is useful in NW.js to see the messages logged to the regular Chromium Developer Tools instead of the background page's developer tools. But this can also be useful in other scenarios, like adding in custom wrappers or colors in a command line/terminal. This function may be called multiple times before all synchronous tasks complete.


### `require('node-default-application-protocol').setAsDefault()`

**NOT IMPLEMENTED**

Returns boolean. `true` = worked. `false` = didn't work.

**Key**         | **Type** | **Allowed**              | **Default**                  | **Description**
:--             | :--      | :--                      | :--                          | :--
`protocol`      | String   | Any URL safe string      | **This is a required field** | This is the custom protocol you are defining.
`executable`    | String   | Any valid path to a file | `process.execPath`           | The executable called when the custom protocol is called


### `require('node-default-application-protocol').isDefault()`

**NOT IMPLEMENTED**

Returns boolean. `true` = is set as default. `false` = is not set as default.

**Key**         | **Type** | **Allowed**              | **Default**                  | **Description**
:--             | :--      | :--                      | :--                          | :--
`protocol`      | String   | Any URL safe string      | **This is a required field** | This is the custom protocol you are checking.
`executable`    | String   | Any valid path to a file | `process.execPath`           | The executable called when the custom protocol is called



### `require('node-default-application-protocol').removeDefault()`

**NOT IMPLEMENTED**

Returns boolean. `true` = worked. `false` = didn't work.

**Key**         | **Type** | **Allowed**              | **Default**                  | **Description**
:--             | :--      | :--                      | :--                          | :--
`protocol`      | String   | Any URL safe string      | **This is a required field** | This is the custom protocol you are removing.
`executable`    | String   | Any valid path to a file | `process.execPath`           | The executable called when the custom protocol was called


### `require('node-default-application-protocol').checkDefault()`

**NOT IMPLEMENTED**

Returns string of the application set as the default for the passed in protocol. String format may differ depending on platform.

**Key**         | **Type** | **Allowed**              | **Default**                  | **Description**
:--             | :--      | :--                      | :--                          | :--
`protocol`      | String   | Any URL safe string      | **This is a required field** | This is the custom protocol you are checking.



* * *

The solution comes from:

* https://www.elasticfeed.com/fd4bf52a2301ddee57a5c225d09a5778/

It links to other resources which have already faded from the internet, so for safety I will duplicate its contents here below.


* * *

* * *

* * *


# [How to register a url protocol handler in Node.js](https://www.nodejsrecipes.com/recipes/18534591/how-to-register-a-url-protocol-handler-in-node-js)


## Problem

I am developing a command line node module and would like to be able to launch it via links on a website.

I want to register a custom protocol `my-module://` such that links would have the following format: `my-module://action:some-action` and clicking on them would start the node package.

If there isn't a Node API for this (I'm sure there won't be) then is there a way I can do it from Node by invoking system commands?

It must work on Windows, Linux, and MacOS.

* Problem courtesy of: [Daniel Chatfield](https://stackoverflow.com/users/568805/daniel-chatfield)


## Solution

It's an interesting idea. I don't think there is currently a cross-platform **Node.js** solution out there. I did come across this thread of people asking for the same thing:

* https://github.com/rogerwang/node-webkit/issues/951

Electron now supports it with the [`app.setAsDefaultProtocolClient`](https://electron.atom.io/docs/api/app/#appsetasdefaultprotocolclientprotocol-path-args-macos-windows) API ([since v0.37.4](https://github.com/electron/electron/releases/tag/v0.37.4)) for macOS and Windows.

It wouldn't be terribly difficult to write the library to do this.


### **Windows**:

On the Windows side you'd have to register the app as the application that handles that URI scheme.

You'll need to set up a registry entry for your application:

```
HKEY_CLASSES_ROOT
   alert
      (Default) = "URL:Alert Protocol"
      URL Protocol = ""
      DefaultIcon
         (Default) = "alert.exe,1"
      shell
         open
            command
               (Default) = "C:\Program Files\Alert\alert.exe" "%1"
```

Then, when your application is run by Windows, you should be able to see the arguments in `process.argv[]`. Make sure that you launch a shell to run Node, not just your application directly.

* [Original MSDN article](https://msdn.microsoft.com/en-us/library/aa767914(VS.85).aspx)

Note this requires administrator privileges and sets the handler system-wide. To do it per user, you can use `HKEY_CURRENT_USER\Software\Classes` instead.

* [Electron's implementation](https://github.com/electron/electron/blob/4ec7cc913d840ee211a92afa13f260681d8bf8f9/atom/browser/browser_win.cc#L203)


### **OSX**:

The cited "OSX" article in the GitHub comment is actually for iOS. I'd look at the following programming guide for info on registering an application to handle a URL scheme:

* [Apple Dev Documentation](https://developer.apple.com/library/mac/documentation/Carbon/Conceptual/LaunchServicesConcepts/LSCConcepts/LSCConcepts.html#//apple_ref/doc/uid/TP30000999-CH202-CIHFEEAD)

In summary, you'll need to create a launch service and populate the `.plist` file with `CFBundleURLTypes`, this field is an array and should be populated with just the protocol name i.e. `http`

The following [Super User Question](https://superuser.com/questions/548119/how-do-i-configure-custom-url-handlers-on-os-x) has a better solution, but is a per user setting.

> "The file you seek is `~/Library/Preferences/com.apple.LaunchServices.plist`.
> It holds an array called `LSHandlers`, and the Dictionary children that define an `LSHandlerURLScheme` can be modified accordingly with the `LSHandlerRole`."


### **Linux**:

From what I can tell, there are several ways to accomplish this in Linux (surprise?)

Gnome has a tool that will let you register a url handler [w3 archives](http://people.w3.org/~dom/archives/2005/09/integrating-a-new-uris-scheme-handler-to-gnome-and-firefox/)

```
gconftool-2 -t string -s /desktop/gnome/url-handlers/tel/command "bin/vonage-call %s"
gconftool-2 -s /desktop/gnome/url-handlers/tel/needs_terminal false -t bool
gconftool-2 -t bool -s /desktop/gnome/url-handlers/tel/enabled true
```

Some of the lighter weight managers look like they allow you to create fake mime types and register them as URI Protocol handlers.

> "Fake mime-types are created for URIs with various scheme like this: `application/x-xdg-protocol-`
> Applications supporting specific URI protocol can add the fake mime-type to their MimeType key in their desktop entry files. So it's easy to find out all applications installed on the system supporting a URI scheme by looking in `mimeinfo.cache` file. Again `defaults.list` file can be used to specify a default program for speficied URI type." - [wiki.lxde.org](https://wiki.lxde.org/en/Desktop_Preferred_Applications_Specification)

KDE also supports their own method of handling URL Protocol Handlers:

Create a file: `$KDEDIR/share/services/your.protocol` and populate it with relevant data:

```
[Protocol]
exec=/path/to/player "%u"
protocol=lastfm
input=none
output=none
helper=true
listing=
reading=false
writing=false
makedir=false
deleting=false
```

from [last.fm forums](https://www.last.fm/forum/21714/_/42837/1#f430232) of all places

Hope that helps.

Solution courtesy of: [jeremy](https://stackoverflow.com/users/1356721/jeremy)

## Discussion

* [View additional discussion](https://www.nodejsrecipes.com/recipes/18534591/how-to-register-a-url-protocol-handler-in-node-js)

* * *

* * *

* * *

# Related Resources:

* [The same idea but for iOS/Android](https://www.npmjs.com/package/nativescript-appurl-handler)
* [Cross-Platform Node.js library for creating desktop shortcuts](https://github.com/nwutils/create-desktop-shortcuts)
* [NW.js - Tool for making cross-platform desktop apps](https://nwjs.io)
