port module Main exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)

main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

init : (Model, Cmd Msg)
init = (Model (BookmarkIO Nothing "0" []) "", Cmd.none)

type alias Bookmark =
    { id: String, title: String, isFolder: Bool }

type alias BookmarkIO =
  { parentId: Maybe String, currentRootId: String, children: List Bookmark }

type alias InsertBookmarkIO =
  { parentId: String, json: String }

type alias Model =
    { currentItem: BookmarkIO
    , jsonText: String
    }

type Msg
    = InputJson String
    | FetchBookmarks String
    | BookmarkResult BookmarkIO
    | InsertBookmarks InsertBookmarkIO


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    InputJson text -> ({ model | jsonText = text}, Cmd.none)
    FetchBookmarks id -> (model, getBookmarks id)
    BookmarkResult bookmarkIO -> ({ model | currentItem = bookmarkIO }, Cmd.none)
    InsertBookmarks x -> (model, insertBookmarks x)

port getBookmarks : String -> Cmd msg
port insertBookmarks : InsertBookmarkIO -> Cmd msg

port bookmarks : (BookmarkIO -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
  bookmarks BookmarkResult


getInsertBookmarkIOFor : Model -> InsertBookmarkIO
getInsertBookmarkIOFor model = InsertBookmarkIO model.currentItem.currentRootId model.jsonText

view : Model -> Html Msg
view model =
  div [class "wrapper"]
    [ viewBackButtonOrEmpty model
    , div [] (List.map viewBookmark model.currentItem.children)
    , viewJsonPasteOrEmpty model
    ]

viewJsonPasteOrEmpty : Model -> Html Msg
viewJsonPasteOrEmpty model =
  case model.currentItem.currentRootId of
    "0" -> text ""
    otherwise ->
      div [class "json-paste-wrapper"]
        [ textarea [class "json-textarea", onInput InputJson, value model.jsonText] []
        , button [onClick (InsertBookmarks (getInsertBookmarkIOFor model))] [text "add"]
        ]

viewBackButtonOrEmpty : Model -> Html Msg
viewBackButtonOrEmpty model =
    case model.currentItem.parentId of
        Nothing -> text ""
        Just parentId -> button [class "back-button", onClick (FetchBookmarks parentId)] [text "< Back"]

viewBookmark : Bookmark -> Html Msg
viewBookmark b =
    if b.isFolder then
        div [] [a [class "is-dir", onClick (FetchBookmarks b.id)] [text b.title]]
    else
        div [] [a [class "is-link"] [text b.title]]
