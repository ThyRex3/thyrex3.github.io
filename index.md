---
layout: page
---
<h1>It's so Toas-THY in here!</h1>

Hi!  I'm [Thy Dai](mailto:tdai1011@gmail.com).  This is a small personal website to house my resume and portfolio.

<div class="list-group">
  <h1>Recent Tutorials</h1>
  <ul class="posts noList">
  {% for post in site.posts limit:3 %}
    <li>
      <h3><a href="{{site.baseurl}}{{post.url}}">{{ post.title }}</a></h3>
      <p class="text-muted">
      <time datetime="{{ page.date | date_to_xmlschema }}">
        {%- assign date_format = "%b %-d, %Y" -%}
        {{ post.date | date: date_format }}
      </time>
      {% if post %}
        • {% assign categories = post.categories %}
      {% else %}
        • {% assign categories = page.categories %}
      {% endif %}
      {% for category in categories %}
        <a href="{{site.baseurl}}/categories/{{category|slugize}}">{{category}}</a>
        {% unless forloop.last %}|{% endunless %}
      {% endfor %}
      </p>
      <p>{% if post.description %}{{ post.description }}{% else %}{{ post.excerpt | strip_html }}{% endif %}</p>
    </li>
  {% endfor %}
  </ul>
</div>
