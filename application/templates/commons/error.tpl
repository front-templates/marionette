<div class="alert alert-danger">
	<strong>
		{{#if responseJSON}}
			<pre>{{responseJSON.errorMessage}}</pre>
		{{else}}
			Error!
		{{/if}}
	</strong>
</div>