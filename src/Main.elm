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
    = BookmarkResult (List Bookmark)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    BookmarkResult bs -> (Model bs, Cmd.none)

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
    let cssClass = if b.isFolder then "is-dir" else "is-link"
    in div [] [a [class cssClass] [text b.title]]
