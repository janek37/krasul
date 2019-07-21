import graphene

import krasul.crosswords.schema


class Query(krasul.crosswords.schema.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
