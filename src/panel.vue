<template>
	<div v-if="!hasPermission" :class="`panel-error`">
		<v-notice type="danger" icon="warning">You do not have permissions to {{ collection }}</v-notice>
	</div>
	<div v-else :class="`panel-internal-form ${(width<30?'small':'large')} ${showHeader?'has-header':''}`">
		<!-- Form goes here -->
		<v-form
			v-if="fieldData"
			:fields="fieldData"
			v-model="formData"
		/>
		<v-button v-if="Object.keys(formData).length > 0" @click="submitForm()">Save</v-button>
		<v-button v-else secondary>Save</v-button>

		<v-dialog v-model="responseDialog" @esc="responseDialog = false">
			<v-sheet>
				<v-notice type="success" icon="done" v-if="form_response[primaryKeyField.field]">Saved</v-notice>
				<v-notice type="danger" icon="warning" v-else-if="form_error">An Error Occurred</v-notice>
				<v-notice type="danger" icon="warning" v-else>No Response</v-notice>
				<blockquote v-if="form_response" class="form-response">
					<!-- {{  form_response }} -->
					<router-link :to="getLinkForItem(form_response)">
						<render-template
							:collection="collection"
							:template="response_format"
							:item="form_response"
						/>
						<v-icon name="launch" small />
					</router-link>
				</blockquote>
				<blockquote v-else-if="form_error" class="">
					{{ form_error }}
				</blockquote>
				
				<v-button  @click="responseDialog = false">Done</v-button>
			</v-sheet>
		</v-dialog>
	</div>
</template>

<script>
import { useApi, useCollection, useStores } from '@directus/extensions-sdk';
import { ref, watch } from 'vue';
export default {
	props: {
		showHeader: {
			type: Boolean,
			default: false,
		},
		collection: {
			type: String,
			default: '',
		},
		fields: {
			type: Array,
			default: [],
		},
		response_format: {
			type: String,
			default: '',
		},
		width: String,
		height: String,
	},
	setup(props){
		const { useFieldsStore, usePermissionsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const permissionsStore = usePermissionsStore();
		const hasPermission = permissionsStore(props.collection, 'create');
		const api = useApi();
		const { primaryKeyField } = useCollection(props.collection);
		
		const formData = ref({});
		const fieldData = ref([]);

		const form_response = ref({});
		const form_error = ref({});
		const responseDialog = ref(false);

		function getFields(){
			fieldData.value = [];
			props.fields.forEach(field => {
				fieldData.value.push(fieldsStore.getField(props.collection, field));
			});
		}

		getFields();

		function submitForm(){
			api.post(`/items/${props.collection}`, formData.value).then((response) => {
				form_response.value = response.data.data;
				responseDialog.value = true;
				formData.value = {};
			}).catch((error) => {
				console.error(error);
				form_error.value = error;
				responseDialog.value = true;
			});
		}

		watch(
			[
				() => props.collection,
				() => props.fields,
				() => props.response_format
			],
			() => {
				getFields();
			},
		);

		return { hasPermission, primaryKeyField, formData, fieldData, submitForm, form_response, form_error, responseDialog, getLinkForItem };

		function getLinkForItem(item) {
			if(item === undefined) return;
			const primaryKey = item[primaryKeyField.value.field];
			return `/content/${props.collection}/${encodeURIComponent(primaryKey)}`;
		}

	},
};
</script>

<style>
.panel-internal-form {
	padding: 12px;
}

.panel-internal-form.has-header {
	padding: 0 12px;
}

.panel-internal-form.small .field {
	grid-column: start/fill;
}

.panel-internal-form .v-form {
	margin-bottom: var(--form-vertical-gap);
}

.form-response {
	border-radius: var(--border-radius);
	border: var(--border-width) solid var(--border-normal);
	margin: 1em 0;
	min-width: 300px;
}

.form-response a {
	position: relative;
	display: block;
	padding: var(--input-padding);
}

.form-response a:hover {
	cursor: pointer;
	background-color: var(--v-list-item-background-color-hover);
}

.form-response a .v-icon {
	position: absolute;
	right: var(--input-padding);
	top: var(--input-padding);
}
</style>
