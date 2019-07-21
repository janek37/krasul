import graphene
from graphene_django import DjangoObjectType

from .models import Crossword


class CrosswordType(DjangoObjectType):
    class Meta:
        model = Crossword


class Query(graphene.ObjectType):
    crosswords = graphene.List(CrosswordType)

    @staticmethod
    def resolve_crosswords(parent, info, **kwargs):
        return Crossword.objects.all()
