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
init = (Model Nothing "0" "" [], Cmd.none)

type alias Bookmark =
    { id: String, title: String, isFolder: Bool }

type alias Model =
    { parentId: Maybe String
    , currentRootId: String
    , jsonText: String
    , bookmarks: List Bookmark
    }

type Msg
    = InputJson String
    | FetchBookmarks String
    | BookmarkResult Model


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    InputJson text -> ({ model | jsonText = text}, Cmd.none)
    FetchBookmarks id -> (model, getBookmarks id)
    BookmarkResult model -> (model, Cmd.none)

port getBookmarks : String -> Cmd msg

port bookmarks : (Model -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
  bookmarks BookmarkResult


view : Model -> Html Msg
view model =
  div [class "wrapper"]
    [ viewBackButtonOrEmpty model
    , div [] (List.map viewBookmark model.bookmarks)
    , div []
      [ textarea [onInput InputJson, value model.jsonText] []
      ]
    ]

viewBackButtonOrEmpty : Model -> Html Msg
viewBackButtonOrEmpty model =
    case model.parentId of
        Nothing -> text ""
        Just parentId -> button [class "back-button", onClick (FetchBookmarks parentId)] [text "< Back"]

viewBookmark : Bookmark -> Html Msg
viewBookmark b =
    if b.isFolder then
        div [] [a [class "is-dir", onClick (FetchBookmarks b.id)] [text b.title]]
    else
        div [] [a [class "is-link"] [text b.title]]
