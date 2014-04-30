pilot-e-application
===================

This is not the implementation of whole pilot e application anymore but only of serveral widgets, such as the capture wirecloud widget or several debriefing widgets, etc.

## Capture Widget

### Interface

```xml
    <Platform.Wiring>
        <InputEndpoint
            name="setWorldstate"
            type="text"
            label="Set Worldstate"
            description="Sets a worldstate (JSON-String, min level 3) to be displayed or edited. However, if the widget is currently editing (see set/isEditing) it will prompt the user if he wants to discard changes. If the user is positive about discard then the new worldstate data is loaded and an 'isEditing' event with the value 'false' is issued, otherwise the worldstate will remain the old one and an 'isEditing' event with value 'false' is issued."
            friendcode="worldstate_json_expanded"/>
        <InputEndpoint
            name="setEditing"
            type="text"
            label="Set Editing"
            description="Toggle editing mode. If the provided value is 'true' the widget will switch to editing mode. If the provided value is 'false' and the widget is currently in editing mode the widget will probably stop editing: The user is asked if he wants to stop editing. If his answer is 'No' an 'isEditing' event with the value 'true' is issued. If his answer is 'Yes' the current values will be pushed to the backend and a 'getDataitem' event with a transient dataitem will be issued. This dataitem is not stored by the component (thus transient) and does not contain an 'id' or '$self' property as the widget does not know the origin of the worldstate and thus cannot fetch a proper id."
            friendcode="boolean"/>
        <OutputEndpoint
            name="getDataitem"
            type="text"
            label="Get the newly created Dataitem"
            description="Event that is issued if editing mode was started and stopped successfully (without user veto or discard). Provides a transient dataitem that does not contain 'id' or '$self'."
            friendcode="dataslot_json_expanded"/>
        <OutputEndpoint
            name="isEditing"
            type="text"
            label="Is in editing mode"
            description="Event that is issued on varous occasions, see input endpoints"
            friendcode="boolean"/>
    </Platform.Wiring>
```
