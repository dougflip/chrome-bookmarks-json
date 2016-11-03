port module BookmarkPorts exposing (..)


type alias Bookmark =
    { id : String, title : String, isFolder : Bool }


type alias BookmarkIO =
    { parentId : Maybe String, currentRootId : String, title : String, children : List Bookmark }


type alias InsertBookmarkIO =
    { parentId : String, json : String }


port getBookmarks : String -> Cmd msg


port insertBookmarks : InsertBookmarkIO -> Cmd msg


port bookmarks : (BookmarkIO -> msg) -> Sub msg


port reportJSError : (String -> msg) -> Sub msg
