import json
from datetime import datetime, timedelta, time
from django.http import HttpResponse
from django.core import serializers
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from emails.models import Email

class Ordenacao(object):
	def __init__(self, j):
		self.__dict__ = json.loads(j)


# Create your views here.
def listar_todos(request):
	hoje = request.GET.get('hoje')
	filtro = request.GET.get('filtro')
	pagina = request.GET.get('pagina')
	ordenacao = request.GET.get('ordenacao')
	emails = Email.objects.all()

	if(ordenacao):
		ordenacao = Ordenacao(ordenacao)
		sentidoOrdenacao = "" if ordenacao.tipo == "+" else ordenacao.tipo
		emails = emails.extra(select={'campo_lowercase':'lower(' + ordenacao.campo + ')'}).order_by(sentidoOrdenacao + 'campo_lowercase')

	if hoje and hoje == 'true':
		today = datetime.now().date()
		tomorrow = today + timedelta(1)
		today_start = datetime.combine(today, time())
		today_end = datetime.combine(tomorrow, time())
		emails = emails.filter(data_envio__lte=today_end, data_envio__gte=today_start)

	if(filtro):
		emails = emails.filter(Q(nome__icontains=filtro) | Q(assunto__icontains=filtro))

	try:
		paginator = Paginator(emails, 10) # Mostra 10 emails por pagina
		emails = paginator.page(pagina)
	except PageNotAnInteger:
		# Se pagina nao for um inteiro, seleciona a primeira pagina.
		emails = paginator.page(1)
	except EmptyPage:
		# Se pagina estiver fora do intervalo maximo (e.g. 9999), seleciona a ultima pagina com resultado.
		emails = paginator.page(paginator.num_pages)

	data = serializers.serialize('json', emails, ensure_ascii=False)
	return HttpResponse(data, mimetype='application/json; charset=utf8')

def total(request):
	filtro = request.GET.get('filtro')
	hoje = request.GET.get('hoje')
	emails = Email.objects.all();

	if hoje and hoje == 'true':
		today = datetime.now().date()
		tomorrow = today + timedelta(1)
		today_start = datetime.combine(today, time())
		today_end = datetime.combine(tomorrow, time())
		emails = emails.filter(data_envio__lte=today_end, data_envio__gte=today_start)


	if(filtro):
		emails = emails.filter(Q(nome__icontains=filtro) | Q(assunto__icontains=filtro))

	num_elementos = emails.count();
	return HttpResponse(num_elementos, mimetype='application/json; charset=utf8')