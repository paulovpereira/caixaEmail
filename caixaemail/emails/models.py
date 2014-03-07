from django.db import models

# Create your models here.
class Email(models.Model):
	nome = models.CharField(max_length=80);
	assunto = models.CharField(max_length=200)
	data_envio = models.DateTimeField('Data de envio')

	def __unicode__(self):
   	  return self.assunto
		