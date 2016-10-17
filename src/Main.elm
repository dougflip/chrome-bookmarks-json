port module Main exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String

main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

init : (Model, Cmd Msg)
init = (Model [], Cmd.none)

type alias Bookmark =
    { id: String, title: String, isFolder: Bool }

type alias Model =
    { bookmarks: List Bookmark }

type Msg
    = GetBookmarks String
    | BookmarkResult (List Bookmark)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GetBookmarks id -> (model, getBookmarks id)
    BookmarkResult bs -> (Model bs, Cmd.none)

port getBookmarks : String -> Cmd msg

port bookmarks : (List Bookmark -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
  bookmarks BookmarkResult


view : Model -> Html Msg
view model =
  div [class "wrapper"]
    [
        div [] (List.map renderBookmark model.bookmarks)
    ]

renderBookmark : Bookmark -> Html Msg
renderBookmark b =
    if b.isFolder then
        div [] [a [class "is-dir", onClick (GetBookmarks b.id)] [text b.title]]
    else
        div [] [a [class "is-link"] [text b.title]]
