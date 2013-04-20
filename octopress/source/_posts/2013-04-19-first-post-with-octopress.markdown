---
layout: post
title: "First Post with Octopress"
date: 2013-04-19 00:08
comments: true
categories: test
---

Testing content...

Instalação do octopress (http://octopress.org/) "A blogging framework for hackers" no tecendobits.cc.

Primeiramente, seguir os passos de setup de http://octopress.org/docs/setup/.
O git já tenho instalado, preciso instalar o Ruby. Para isso, via git no terminal (os comandos estão para instalar em home):

{% codeblock lang:objc %}
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
source ~/.bash_profile
{% endcodeblock %}

Dica: não dá pra instalar por Rbenv tendo o rvm instalado! Lembre-se de remover se for o caso.

<!-- more --> 

Próximo passo: Instalar Ruby 1.9.3.
Vergonhosamente, deu erro no meu gcc (ainda estou aprendendo a lidar com o OSX) :P

{% codeblock lang:objc %}
DETAILS: Apple no longer includes the official GCC compiler with Xcode
as of version 4.2. Instead, the `gcc` executable is a symlink to
`llvm-gcc`, a modified version of GCC which outputs LLVM bytecode.

For most programs the `llvm-gcc` compiler works fine. However,
versions of Ruby older than 1.9.3-p125 are incompatible with
`llvm-gcc`. To build older versions of Ruby you must have the official
GCC compiler installed on your system.
{% endcodeblock %}

Seguindo as instruções dadas para instalar o GCC executável via homebrew:
{% codeblock lang:objc %}
brew tap homebrew/dupes
brew install apple-gcc42
{% endcodeblock %}

Feito isso, finalmente instalar Ruby:
{% codeblock lang:objc %}
rbenv install 1.9.3-p0
rbenv rehash
{% endcodeblock %}

Tudo instalado certo, rodo ruby --version e minha versão é a 1.8.7 e
não a 1.9.3. Um pouco de pesquisa via google:
{% codeblock lang:objc %}
rbenv global 1.9.3-p0
ruby --version
{% endcodeblock %}

Agora o sistema reconhece a versão certa (Ruby 1.9.3)!
Sistema pronto para instalar o Octopress.

{% codeblock lang:objc %}
git clone git://github.com/imathis/octopress.git octopress
cd octopress
ruby --version 
{% endcodeblock %}

Nesse momento o terminal deve mostrar Ruby 1.9.3. Infelizmente, aqui
apareceu "rbenv: version `1.9.3-p194' is not installed". Porquê? No
setup do octopress falam para instalar o 1.9.3-p0, mas o sistema está
requisitando 1.9.3-p194. O que acho que devemos fazer?
{% codeblock lang:objc %}
rbenv install 1.9.3-p194
{% endcodeblock %}

Felizmente, os próximos passos executaram sem problemas!
{% codeblock lang:objc %}
gem install bundler
rbenv rehash
bundle install
rake install
{% endcodeblock %}

 Hora de subir no servidor!

{% codeblock lang:objc %}
rake generate
{% endcodeblock %}

editar _config.yml para ter blog como subdiretório:

{% codeblock lang:objc %}
# ----------------------- #
#      Main Configs       #
# ----------------------- #

url: http://tecendobits.cc/blog
title: TecendoBits Blog
subtitle: A place to random thoughts.
author: gabithume
simple_search: http://google.com/search
subscribe_rss: /blog/atom.xml
email: gabithume@gmail.com
{% endcodeblock %}



{% codeblock lang:objc %}
root: /blog
permalink: /:title/
destination: public/blog
{% endcodeblock %}

no config.rb:

{% codeblock lang:objc %}
# Publishing paths                                                                           
http_path = "/blog"
http_images_path = "/blog/images"
http_fonts_path = "/blog/fonts"
css_dir = "public/blog/stylesheets"
{% endcodeblock %}

Rakefile:

{% codeblock lang:objc %}
## -- Misc Configs -- ##

public_dir      = "public/blog" 
{% endcodeblock %}

No servidor, permite ter o blog em tecendobits/blog ao invés de tecendobits/blog/blog:
echo "blog" > .gitignore # o git ignora o blog
ln -s octopress/public/blog blog # link simbólico do public/blog para blog

{% codeblock lang:objc %}
rake new_post["First Post with Octopress"]
{% endcodeblock %}

19/04

Como customizar o template do Octopress?

http://www.google.com/fonts/#

<link href='http://fonts.googleapis.com/css?family=Gochi+Hand'
rel='stylesheet' type='text/css'>

Para editar, deixo o rake preview rolando e qndo faço modificações,
rodo rake generate e visualizo em localhost:4000/blog

