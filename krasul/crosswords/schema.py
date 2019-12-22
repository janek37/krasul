import graphene
from graphene_django import DjangoObjectType

from .models import Crossword, Square, Entry


class CrosswordType(DjangoObjectType):
    class Meta:
        model = Crossword


class SquareType(DjangoObjectType):
    class Meta:
        model = Square


class EntryType(DjangoObjectType):
    class Meta:
        model = Entry

    def resolve_squares(self, info):
        return self.squares.order_by('entrysquare__index')


class Query(graphene.ObjectType):
    crosswords = graphene.List(CrosswordType)

    @staticmethod
    def resolve_crosswords(parent, info, **kwargs):
        return Crossword.objects.all()
