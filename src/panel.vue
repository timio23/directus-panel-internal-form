<template>
	<div :class="`panel-internal-form ${(width<30?'small':'large')} ${showHeader?'has-header':''}`">
		<v-form
			v-if="fieldData"
			:fields="fieldData"
			v-model="formData"
		/>
		<v-button v-if="Object.keys(formData).length > 0" @click="submitForm">Save</v-button>
		<v-button v-else secondary>Save</v-button>
	</div>
</template>

<script>
import { useApi, useStores } from '@directus/extensions-sdk';
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
		width: String,
		height: String,
	},
	setup(props){
		const { useFieldsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const api = useApi();
		
		const formData = ref({});
		const fieldData = ref([]);
		

		function getFields(){
			fieldData.value = [];
			props.fields.forEach(field => {
				fieldData.value.push(fieldsStore.getField(props.collection, field));
			});
		}

		getFields();

		function submitForm(){
			console.log(formData.value);
			api.post(`/items/${props.collection}`, formData.value).then((response) => {
				console.log(response.data);
				formData.value = {};
			});
		}

		watch(
			[
				() => props.collection,
				() => props.fields
			],
			() => {
				getFields();
			},
		);

		return { formData, fieldData, submitForm };
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
</style>
