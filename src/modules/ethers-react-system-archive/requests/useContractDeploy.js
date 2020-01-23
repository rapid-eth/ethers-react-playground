/**
 * @function useContractDeploy
 * @param {Object} state
 * @param {Object} dispatch
 */

/* --- Global --- */
import { useEffect } from 'react';

/* --- Local --- */
import { CONTRACT_DEPLOY_SUCCESS, CONTRACT_DEPLOY_FAILURE } from '../types';

/* --- Component --- */
export const useContractDeploy = (state, dispatch) => {
  useEffect(() => {
    if (state.core.wallet && state.core.requests.deploy) {
      const runEffect = async () => {
        let contract;
        const request = state.core.requests.deploy[0];
        const { payload } = request;
        try {
          contract = new state.core.instance.ContractFactory(
            payload.contract.abi,
            payload.contract.bytecode,
            state.core.wallet
          );
          const contractDeployRequest = await contract.deploy(
            ...payload.inputs
          );

          // Success : Dispatch
          dispatch({
            type: CONTRACT_DEPLOY_SUCCESS,
            payload: contractDeployRequest.deployTransaction
          });
        } catch (error) {
          console.log(error);
          // Failure : Dispatch
          dispatch({
            type: CONTRACT_DEPLOY_FAILURE,
            delta: request.id,
            payload: error
          });
        }
      };
      runEffect();
    }
  }, [state.core.requests.deploy]);

  return true;
};
