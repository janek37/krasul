from django.db import models


class Crossword(models.Model):
    width = models.IntegerField()
    height = models.IntegerField()


class Square(models.Model):
    crossword = models.ForeignKey(Crossword, on_delete=models.CASCADE, related_name='squares')
    x = models.IntegerField()
    y = models.IntegerField()
    solution = models.CharField(max_length=4, blank=True)

    class Meta:
        ordering = ['y', 'x']


class Entry(models.Model):
    crossword = models.ForeignKey(Crossword, on_delete=models.CASCADE, related_name='entries')
    squares = models.ManyToManyField(Square, through='EntrySquare')
    clue = models.TextField()


class EntrySquare(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    square = models.ForeignKey(Square, on_delete=models.CASCADE)
    index = models.IntegerField()
